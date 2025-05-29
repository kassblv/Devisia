import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import { Prisma,  } from "@/generated/prisma";

// Type pour les données additionnelles stockées dans le champ metadata
interface QuoteMetadata {
  materiaux: any[];
  postes: any[];
  main_oeuvre: {
    heures_estimees: number;
    taux_horaire: number;
    total: number;
  };
  total_ht: number;
  tva: number;
}

// Type pour le devis avec les relations incluses
type QuoteWithRelations = Prisma.QuoteGetPayload<{
  include: {
    client: true;
    items: true;
  }
}>;

// Type étendu pour le devis avec les données complètes
interface CompleteQuote extends QuoteWithRelations {
  materiaux: any[];
  postes: any[];
  main_oeuvre: {
    heures_estimees: number;
    taux_horaire: number;
    total: number;
  };
  total_ht: number;
  tva: number;
  total_ttc: number;
  description?: string;
}

// GET - Récupérer un devis spécifique
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    // Récupérer l'ID de l'utilisateur à partir de la session
    const userId = session.user.id as string;
    
    // Récupérer le devis demandé
    const quote = await prisma.quote.findUnique({
      where: {
        id: params.id,
        userId // S'assurer que le devis appartient à l'utilisateur
      },
      include: {
        client: true,
        items: true
      }
    }) as QuoteWithRelations | null;
    
    if (!quote) {
      return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 });
    }
    
    // Récupérer les données supplémentaires du devis (materiaux, postes, etc.)
    let additionalData: Partial<QuoteMetadata> = {};
    if (quote.metadata) {
      try {
        additionalData = JSON.parse(quote.metadata as string) as Partial<QuoteMetadata>;
      } catch (e) {
        console.error("Erreur lors du parsing des métadonnées:", e);
      }
    }
    
    // Fusionner les données de base et les données supplémentaires
    const completeQuote: CompleteQuote = {
      ...quote,
      // S'assurer que les champs par défaut sont présents
      materiaux: additionalData.materiaux || [],
      postes: additionalData.postes || [],
      main_oeuvre: additionalData.main_oeuvre || {
        heures_estimees: 0,
        taux_horaire: 0,
        total: 0
      },
      total_ht: additionalData.total_ht || 0,
      tva: additionalData.tva || 0,
      total_ttc: quote.totalAmount.toNumber() || 0
    };
    
    return NextResponse.json(completeQuote);
  } catch (error) {
    console.error("Erreur lors de la récupération du devis:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du devis" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un devis existant
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    const userId = session.user.id as string;
    const data = await request.json();
    
    // Vérifier que le devis existe et appartient à l'utilisateur
    const existingQuote = await prisma.quote.findUnique({
      where: {
        id: params.id,
        userId
      }
    });
    
    if (!existingQuote) {
      return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 });
    }
    
    // Préparation des données de mise à jour
    const updateData: {
      status: any;
      expiryDate: Date | null;
      notes: any;
      projet: any;
      totalAmount: any;
      clientName?: string;
      clientEmail?: string;
    } = {
      status: data.status,
      expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      notes: data.description || null,
      projet: data.projet || existingQuote.projet || null,
      totalAmount: data.total_ttc || existingQuote.totalAmount
    };
    
    // Si les informations client sont mises à jour
    if (data.clientName) {
      updateData.clientName = data.clientName;
    }
    if (data.clientEmail) {
      updateData.clientEmail = data.clientEmail;
    }
    
    // Mettre à jour le devis
    const updatedQuote = await prisma.quote.update({
      where: {
        id: params.id
      },
      data: updateData
    });
    
    // Mettre à jour des données additionnelles via une transaction
    // Pour les matériaux, postes et main d'œuvre
    // Ici nous stockons ces données dans un champ JSON
    await prisma.quote.update({
      where: {
        id: params.id
      },
      data: {
        metadata: JSON.stringify({
          materiaux: data.materiaux || [],
          postes: data.postes || [],
          main_oeuvre: data.main_oeuvre || {},
          total_ht: data.total_ht || 0,
          tva: data.tva || 0
        })
      }
    });
    
    return NextResponse.json(updatedQuote);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du devis:", error);
    return NextResponse.json(
      { error: `Erreur lors de la mise à jour du devis: ${error}` },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un devis
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    const userId = session.user.id as string;
    
    // Vérifier que le devis existe et appartient à l'utilisateur
    const existingQuote = await prisma.quote.findUnique({
      where: {
        id: params.id,
        userId
      }
    });
    
    if (!existingQuote) {
      return NextResponse.json({ error: "Devis non trouvé" }, { status: 404 });
    }
    
    // Supprimer tous les éléments du devis
    await prisma.quoteItem.deleteMany({
      where: {
        quoteId: params.id
      }
    });
    
    // Supprimer le devis
    await prisma.quote.delete({
      where: {
        id: params.id
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du devis:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du devis" },
      { status: 500 }
    );
  }
}
