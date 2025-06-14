import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Vérification de l'authentification et des droits admin
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse(
        JSON.stringify({ message: "Non autorisé" }),
        { status: 401 }
      );
    }
    
    // Récupération des paramètres de pagination et filtrage
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';
    const subscription = url.searchParams.get('subscription') || 'all';
    
    // Calcul des offsets pour la pagination
    const skip = (page - 1) * limit;
    
    // Construction des filtres
    const whereClause: any = {};
    
    // Filtre de recherche
    if (search) {
      whereClause.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { companyName: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    // Récupération des utilisateurs avec count et pagination
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          companyName: true,
          createdAt: true,
          updatedAt: true,
          // Compter les devis associés à chaque utilisateur
          _count: {
            select: {
              quotes: true,
              clients: true
            }
          }
        }
      }),
      prisma.user.count({ where: whereClause })
    ]);
    
    // Calcul du nombre total de pages
    const totalPages = Math.ceil(totalCount / limit);
    
    // Transformer les données pour le frontend
    const usersWithSubscription = users.map(user => {
      // Simuler les données d'abonnement (à remplacer par des données réelles)
      // Générer un statut d'abonnement aléatoire pour la démonstration
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
      
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        companyName: user.companyName,
        createdAt: user.createdAt,
        quotesCount: user._count.quotes,
        clientsCount: user._count.clients,
        // Informations d'abonnement simulées
        subscription: {
          status: randomSubscriptionStatus,
          plan: randomSubscriptionType,
          startDate: startDate.toISOString(),
          endDate: endDate ? endDate.toISOString() : null,
          isActive
        }
      };
    });
    
    return NextResponse.json({
      users: usersWithSubscription,
      pagination: {
        page,
        limit,
        totalItems: totalCount,
        totalPages
      }
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erreur lors de la récupération des utilisateurs" }),
      { status: 500 }
    );
  }
}
