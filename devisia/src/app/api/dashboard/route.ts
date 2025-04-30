import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Vérification de l'authentification
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }
    
    // Récupération de l'ID utilisateur depuis la query
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json(
        { message: "ID utilisateur requis" },
        { status: 400 }
      );
    }
    
    // Vérification que l'utilisateur demande ses propres données
    if (session.user.id !== userId) {
      return NextResponse.json(
        { message: "Non autorisé à accéder à ces données" },
        { status: 403 }
      );
    }
    
    // Récupération des statistiques
    const [
      totalQuotes,
      pendingQuotes,
      approvedQuotes,
      quotes
    ] = await Promise.all([
      // Total des devis
      prisma.quote.count({
        where: { userId }
      }),
      
      // Devis en attente (DRAFT ou SENT)
      prisma.quote.count({
        where: { 
          userId,
          OR: [
            { status: "DRAFT" },
            { status: "SENT" }
          ]
        }
      }),
      
      // Devis approuvés
      prisma.quote.count({
        where: { 
          userId,
          status: "APPROVED" 
        }
      }),
      
      // Récents devis pour le tableau
      prisma.quote.findMany({
        where: { userId },
        select: {
          id: true,
          quoteNumber: true,
          clientName: true,
          totalAmount: true,
          status: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      })
    ]);
    
    // Calcul du revenu total des devis approuvés
    const approvedQuotesWithAmount = await prisma.quote.findMany({
      where: { 
        userId,
        status: "APPROVED" 
      },
      select: {
        totalAmount: true
      }
    });
    
    const totalRevenue = approvedQuotesWithAmount.reduce(
      (sum, quote) => sum + Number(quote.totalAmount),
      0
    );
    
    // Formater les dates pour le JSON
    const recentQuotes = quotes.map(quote => ({
      ...quote,
      createdAt: quote.createdAt.toISOString(),
      totalAmount: Number(quote.totalAmount)
    }));
    
    return NextResponse.json({
      stats: {
        totalQuotes,
        pendingQuotes,
        approvedQuotes,
        totalRevenue
      },
      recentQuotes
    });
    
  } catch (error) {
    console.error("Erreur lors de la récupération des données du tableau de bord:", error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des données" },
      { status: 500 }
    );
  }
}
