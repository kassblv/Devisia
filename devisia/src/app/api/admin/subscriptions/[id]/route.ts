import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Type pour les mises à jour de plans d'abonnement
interface SubscriptionPlanUpdateData {
  name?: string;
  description?: string | null;
  price?: number;
  interval?: "MONTHLY" | "YEARLY";
  features?: Array<{
    title: string;
    included: boolean;
  }>;
  isActive?: boolean;
  maxQuotes?: number;
  maxClients?: number;
}

// GET: Récupérer un plan d'abonnement spécifique
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification et le rôle admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = params;

    // Récupérer le plan d'abonnement
    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id },
      include: {
        subscriptions: {
          select: {
            id: true,
            status: true,
            user: {
              select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true
              }
            }
          },
          where: {
            status: {
              in: ["ACTIVE", "TRIAL"]
            }
          }
        }
      }
    });

    if (!plan) {
      return NextResponse.json(
        { error: "Plan d'abonnement non trouvé" },
        { status: 404 }
      );
    }

    // Formater les données pour le frontend
    const formattedPlan = {
      ...plan,
      features: JSON.parse(plan.features),
      price: parseFloat(plan.price.toString()),
      activeSubscriptionsCount: plan.subscriptions.length
    };

    return NextResponse.json(formattedPlan);
  } catch (error) {
    console.error("Erreur lors de la récupération du plan d'abonnement:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// PUT: Mettre à jour un plan d'abonnement
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification et le rôle admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = params;
    const data: SubscriptionPlanUpdateData = await req.json();

    // Vérifier si le plan d'abonnement existe
    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id }
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Plan d'abonnement non trouvé" },
        { status: 404 }
      );
    }

    // Préparer les données à mettre à jour
    const updateData: any = {};
    
    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.price !== undefined) updateData.price = data.price;
    if (data.interval !== undefined) updateData.interval = data.interval;
    if (data.features !== undefined) updateData.features = JSON.stringify(data.features);
    if (data.isActive !== undefined) updateData.isActive = data.isActive;
    if (data.maxQuotes !== undefined) updateData.maxQuotes = data.maxQuotes;
    if (data.maxClients !== undefined) updateData.maxClients = data.maxClients;

    // Mettre à jour le plan d'abonnement
    const updatedPlan = await prisma.subscriptionPlan.update({
      where: { id },
      data: updateData
    });

    // Formater les données pour le frontend
    const formattedPlan = {
      ...updatedPlan,
      features: JSON.parse(updatedPlan.features),
      price: parseFloat(updatedPlan.price.toString())
    };

    return NextResponse.json(formattedPlan);
  } catch (error) {
    console.error("Erreur lors de la mise à jour du plan d'abonnement:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}

// DELETE: Supprimer un plan d'abonnement
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Vérifier l'authentification et le rôle admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = params;

    // Vérifier si le plan d'abonnement existe
    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id },
      include: {
        subscriptions: {
          where: {
            status: {
              in: ["ACTIVE", "TRIAL"]
            }
          }
        }
      }
    });

    if (!existingPlan) {
      return NextResponse.json(
        { error: "Plan d'abonnement non trouvé" },
        { status: 404 }
      );
    }

    // Si le plan a des abonnements actifs, ne pas autoriser la suppression
    if (existingPlan.subscriptions.length > 0) {
      return NextResponse.json(
        { 
          error: "Impossible de supprimer un plan avec des abonnements actifs", 
          activeSubscriptions: existingPlan.subscriptions.length 
        }, 
        { status: 400 }
      );
    }

    // Supprimer le plan d'abonnement
    await prisma.subscriptionPlan.delete({
      where: { id }
    });

    return NextResponse.json(
      { success: true, message: "Plan d'abonnement supprimé avec succès" }
    );
  } catch (error) {
    console.error("Erreur lors de la suppression du plan d'abonnement:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}
