import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Vérification de l'authentification et des droits admin
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse(
        JSON.stringify({ message: "Non autorisé" }),
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Récupérer les informations de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        companyName: true,
        createdAt: true,
        updatedAt: true,
        quotes: {
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            quoteNumber: true,
            totalAmount: true,
            status: true,
            expiryDate: true,
            createdAt: true,
            updatedAt: true,
            projet: true,
            clientId: true,
            client: {
              select: {
                name: true,
                email: true,
                company: true
              }
            }
          }
        },
        clients: {
          select: {
            id: true,
            name: true,
            email: true,
            company: true,
            createdAt: true,
            _count: {
              select: {
                quotes: true
              }
            }
          }
        },
        _count: {
          select: {
            quotes: true,
            clients: true
          }
        }
      }
    });
    
    if (!user) {
      return new NextResponse(
        JSON.stringify({ message: "Utilisateur non trouvé" }),
        { status: 404 }
      );
    }
    
    // Générer les infos d'abonnement simulées
    // À remplacer par des données réelles une fois les abonnements implémentés
    const subscriptionTypes = ['trial', 'standard', 'premium'];
    const subscriptionStatuses = ['active', 'expired', 'canceled'];
    
    const randomSubscriptionType = subscriptionTypes[Math.floor(Math.random() * subscriptionTypes.length)];
    const randomSubscriptionStatus = subscriptionStatuses[Math.floor(Math.random() * subscriptionStatuses.length)];
    const isActive = randomSubscriptionStatus === 'active';
    
    // Générer des dates pour l'abonnement simulé
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6)); // 0 à 6 mois dans le passé
    
    let endDate = null;
    if (randomSubscriptionType === 'trial' || !isActive) {
      endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + (randomSubscriptionType === 'trial' ? 1 : 12)); // 1 mois pour l'essai, 12 mois sinon
    }
    
    const subscriptionInfo = {
      id: `sub_${Math.floor(Math.random() * 10000)}`,
      status: randomSubscriptionStatus,
      plan: randomSubscriptionType,
      startDate: startDate.toISOString(),
      endDate: endDate ? endDate.toISOString() : null,
      isActive,
      price: randomSubscriptionType === 'premium' ? 59 : randomSubscriptionType === 'standard' ? 29 : 0,
      nextBillingDate: isActive && !endDate ? new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString() : null,
      paymentMethod: isActive ? 'card_visa_1234' : null,
    };

    // Calculer quelques statistiques de base
    const totalQuotes = user._count.quotes;
    const totalClients = user._count.clients;
    const totalQuoteAmount = user.quotes.reduce((sum, quote) => sum + Number(quote.totalAmount), 0);
    const averageQuoteAmount = totalQuotes > 0 ? totalQuoteAmount / totalQuotes : 0;
    
    // Formatage de la réponse
    const userDetails = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      companyName: user.companyName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      stats: {
        totalQuotes,
        totalClients,
        totalQuoteAmount,
        averageQuoteAmount
      },
      subscription: subscriptionInfo,
      quotes: user.quotes.map(quote => ({
        ...quote,
        totalAmount: Number(quote.totalAmount)
      })),
      clients: user.clients
    };
    
    return NextResponse.json(userDetails);
  } catch (error) {
    console.error("Erreur lors de la récupération des détails de l'utilisateur:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erreur lors de la récupération des détails de l'utilisateur" }),
      { status: 500 }
    );
  }
}
