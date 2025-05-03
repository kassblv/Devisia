import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    // Récupérer l'ID de l'utilisateur à partir de la session
    const userId = session.user.id as string;
    
    // Récupérer tous les clients de cet utilisateur
    const clients = await prisma.client.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Pour chaque client, récupérer les statistiques des devis
    const enrichedClients = await Promise.all(clients.map(async (client) => {
      // Compter le nombre de devis pour ce client
      const quoteCount = await prisma.quote.count({
        where: {
          clientId: client.id
        }
      });
      
      // Calculer le montant total dépensé par ce client (sur les devis approuvés)
      const totalSpentResult = await prisma.quote.aggregate({
        where: {
          clientId: client.id,
          status: 'APPROVED'
        },
        _sum: {
          totalAmount: true
        }
      });
      
      const totalSpent = totalSpentResult._sum.totalAmount?.toNumber() || 0;
      
      // Retourner le client avec les statistiques
      return {
        ...client,
        quoteCount,
        totalSpent
      };
    }));
    
    return NextResponse.json(enrichedClients);
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  // Vérification de l'authentification
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  try {
    const data = await request.json();
    
    // Validation basique des données
    if (!data.name || !data.email) {
      return NextResponse.json(
        { error: "Le nom et l'email sont obligatoires" },
        { status: 400 }
      );
    }
    
    // Récupérer l'ID de l'utilisateur à partir de la session
    const userId = session.user.id as string;
    
    // Création d'un nouveau client dans la base de données
    const newClient = await prisma.client.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        company: data.company || null,
        address: data.address || null,
        kbis: data.kbis || null,
        vatNumber: data.vatNumber || null,
        notes: data.notes || null,
        user: {
          connect: { id: userId }
        }
      }
    });
    
    // Ajouter les statistiques de base (0 pour un nouveau client)
    const clientWithStats = {
      ...newClient,
      quoteCount: 0,
      totalSpent: 0
    };
    
    return NextResponse.json(clientWithStats, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du client:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du client" },
      { status: 500 }
    );
  }
}
