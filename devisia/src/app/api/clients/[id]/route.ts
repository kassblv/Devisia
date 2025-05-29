import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// GET - Récupérer un client spécifique
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    // Récupérer l'ID de l'utilisateur à partir de la session
    const userId = session.user.id as string;
    
    // Récupération de l'ID du client depuis les paramètres de l'URL
    const clientId = context.params.id;
    
    if (!clientId) {
      return NextResponse.json({ error: "ID client manquant" }, { status: 400 });
    }
    
    // Récupérer le client spécifique
    const client = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: userId // Assurez-vous que le client appartient à cet utilisateur
      }
    });
    
    if (!client) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }
    
    // Compter le nombre de devis pour ce client
    const quoteCount = await prisma.quote.count({
      where: {
        clientId: clientId
      }
    });
    
    // Récupérer les devis de ce client
    const quotes = await prisma.quote.findMany({
      where: {
        clientId: clientId
      },
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        quoteNumber: true,
        totalAmount: true,
        status: true,
        createdAt: true
      }
    });
    
    // Calculer le montant total dépensé
    const totalSpent = quotes.reduce((sum, quote) => {
      return sum + (quote.totalAmount ? Number(quote.totalAmount) : 0);
    }, 0);
    
    // Retourner le client avec des statistiques supplémentaires
    return NextResponse.json({
      ...client,
      statistics: {
        quoteCount,
        totalSpent,
        lastQuote: quotes[0] || null
      },
      quotes: quotes
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du client:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du client" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un client existant
export async function PUT(request: NextRequest, context: { params: { id: string } }) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    const userId = session.user.id as string;
    const clientId = context.params.id;
    const data = await request.json();
    
    // Validation basique des données
    if (!data.name) {
      return NextResponse.json(
        { error: "Le nom du client est requis" },
        { status: 400 }
      );
    }
    
    // Vérifier que le client existe et appartient à cet utilisateur
    const existingClient = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: userId
      }
    });
    
    if (!existingClient) {
      return NextResponse.json(
        { error: "Client non trouvé ou non autorisé" },
        { status: 404 }
      );
    }
    
    // Mettre à jour le client
    const updatedClient = await prisma.client.update({
      where: {
        id: clientId
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        company: data.company,
        address: data.address,
        notes: data.notes
      }
    });
    
    return NextResponse.json(updatedClient);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du client:", error);
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du client" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un client
export async function DELETE(request: NextRequest, context: { params: { id: string } }) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    const userId = session.user.id as string;
    const clientId = context.params.id;
    
    // Vérifier que le client existe et appartient à cet utilisateur
    const existingClient = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: userId
      }
    });
    
    if (!existingClient) {
      return NextResponse.json(
        { error: "Client non trouvé ou non autorisé" },
        { status: 404 }
      );
    }
    
    // Supprimer le client
    await prisma.client.delete({
      where: {
        id: clientId
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du client:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du client" },
      { status: 500 }
    );
  }
}
