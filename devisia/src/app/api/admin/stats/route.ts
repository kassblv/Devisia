import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";

// Type pour les statistiques admin
interface AdminStats {
  totalUsers: number;
  newUsersLastMonth: number;
  activeSubscriptions: number;
  trialUsers: number;
  totalQuotes: number;
  quotesThisMonth: number;
  revenueTotal: number;
  revenueMRR: number;
}

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
    
    // Pour l'instant, on ne vérifie pas les rôles admin mais on pourrait ajouter cette vérification ici
    // Nous simulons des données puisqu'il n'y a pas encore de modèle d'abonnement
    
    // Statistiques des utilisateurs
    const totalUsers = await prisma.user.count();
    
    // Nouveaux utilisateurs des 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const newUsersLastMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    
    // Statistiques des devis
    const totalQuotes = await prisma.quote.count();
    
    const quotesThisMonth = await prisma.quote.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });
    
    // On simule les données d'abonnement pour l'instant
    // À remplacer par des données réelles une fois les abonnements implémentés
    const activeSubscriptions = Math.floor(totalUsers * 0.7); // 70% des utilisateurs
    const trialUsers = Math.floor(totalUsers * 0.2); // 20% des utilisateurs en essai
    
    // Calcul de revenus simulés
    // À remplacer par des données réelles une fois les abonnements implémentés
    const standardPrice = 29;
    const premiumPrice = 59;
    const standardUsers = Math.floor(activeSubscriptions * 0.6);
    const premiumUsers = activeSubscriptions - standardUsers;
    
    const revenueMRR = (standardUsers * standardPrice) + (premiumUsers * premiumPrice);
    const revenueTotal = revenueMRR * 6; // Estimation sur 6 mois
    
    const stats: AdminStats = {
      totalUsers,
      newUsersLastMonth,
      activeSubscriptions,
      trialUsers,
      totalQuotes,
      quotesThisMonth,
      revenueTotal,
      revenueMRR
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return new NextResponse(
      JSON.stringify({ message: "Erreur lors de la récupération des statistiques" }),
      { status: 500 }
    );
  }
}
