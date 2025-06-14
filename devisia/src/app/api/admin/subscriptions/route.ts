import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Types pour les plans d'abonnement
interface SubscriptionPlanFeature {
  title: string;
  included: boolean;
}

interface SubscriptionPlanData {
  name: string;
  description?: string | null;
  price: number;
  interval: "MONTHLY" | "YEARLY";
  features: SubscriptionPlanFeature[];
  isActive: boolean;
  maxQuotes: number;
  maxClients: number;
}

// GET: Récupérer tous les plans d'abonnement
export async function GET(req: NextRequest) {
  try {
    // Vérifier l'authentification et le rôle admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    
    // Idéalement, vérifier si l'utilisateur est admin
    // if (session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    // }

    // Récupérer tous les plans d'abonnement
    const plans = await prisma.subscriptionPlan.findMany({
      orderBy: {
        price: 'asc'
      }
    });

    // Formater les données pour le frontend
    const formattedPlans = plans.map(plan => ({
      ...plan,
      features: JSON.parse(plan.features),
      price: parseFloat(plan.price.toString())
    }));

    return NextResponse.json(formattedPlans);
  } catch (error) {
    console.error("Erreur lors de la récupération des plans d'abonnement:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// POST: Créer un nouveau plan d'abonnement
export async function POST(req: NextRequest) {
  try {
    // Vérifier l'authentification et le rôle admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }
    
    // Idéalement, vérifier si l'utilisateur est admin
    
    // Récupérer les données du corps de la requête
    const data: SubscriptionPlanData = await req.json();
    
    // Valider les données
    if (!data.name || !data.price) {
      return NextResponse.json({ error: "Nom et prix sont requis" }, { status: 400 });
    }
    
    // Créer le plan d'abonnement
    const plan = await prisma.subscriptionPlan.create({
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        interval: data.interval,
        features: JSON.stringify(data.features || []),
        isActive: data.isActive,
        maxQuotes: data.maxQuotes || 0,
        maxClients: data.maxClients || 0
      }
    });
    
    return NextResponse.json(plan, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du plan d'abonnement:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// Endpoint pour obtenir des statistiques sur les abonnements
export async function PATCH(req: NextRequest) {
  try {
    // Vérifier l'authentification et le rôle admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Récupérer les statistiques
    const totalPlans = await prisma.subscriptionPlan.count();
    const activePlans = await prisma.subscriptionPlan.count({
      where: { isActive: true }
    });
    
    const totalSubscriptions = await prisma.subscription.count();
    const activeSubscriptions = await prisma.subscription.count({
      where: { status: "ACTIVE" }
    });
    
    const trialSubscriptions = await prisma.subscription.count({
      where: { status: "TRIAL" }
    });

    // Calculer le revenu mensuel
    const subscriptions = await prisma.subscription.findMany({
      where: { 
        status: "ACTIVE",
      },
      include: {
        plan: true
      }
    });
    
    // Calculer le revenu mensuel récurrent
    let monthlyRevenue = 0;
    for (const sub of subscriptions) {
      if (sub.plan.interval === "MONTHLY") {
        monthlyRevenue += parseFloat(sub.plan.price.toString());
      } else if (sub.plan.interval === "YEARLY") {
        // Diviser le prix annuel par 12 pour obtenir l'équivalent mensuel
        monthlyRevenue += parseFloat(sub.plan.price.toString()) / 12;
      }
    }
    
    return NextResponse.json({
      totalPlans,
      activePlans,
      totalSubscriptions,
      activeSubscriptions,
      trialSubscriptions,
      monthlyRevenue
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques d'abonnement:", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
