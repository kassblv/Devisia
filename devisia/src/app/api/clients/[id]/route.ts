import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    // Récupérer l'ID de l'utilisateur à partir de la session
    const userId = session.user.id as string;
    const clientId = params.id;
    
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
        expiryDate: true,
        createdAt: true
      }
    });
    
    // Calculer le montant total dépensé
    const totalSpentResult = await prisma.quote.aggregate({
      where: {
        clientId: clientId,
        status: 'APPROVED'
      },
      _sum: {
        totalAmount: true
      }
    });
    
    const totalSpent = totalSpentResult._sum.totalAmount?.toNumber() || 0;
    
    // Retourner le client avec les statistiques et les devis
    return NextResponse.json({
      ...client,
      quoteCount,
      totalSpent,
      quotes
    });
  } catch (error) {
    console.error("Erreur lors de la récupération du client:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération du client" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    const userId = session.user.id as string;
    const clientId = params.id;
    const data = await request.json();
    
    // Validation basique des données
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: "Le nom et l'email sont obligatoires" },
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
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }
    
    // Mise à jour du client
    const updatedClient = await prisma.client.update({
      where: {
        id: clientId
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        address: data.address || null,
        kbis: data.kbis || null,
        vatNumber: data.vatNumber || null,
        notes: data.notes || null
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    const userId = session.user.id as string;
    const clientId = params.id;
    
    // Vérifier que le client existe et appartient à cet utilisateur
    const existingClient = await prisma.client.findFirst({
      where: {
        id: clientId,
        userId: userId
      }
    });
    
    if (!existingClient) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
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
