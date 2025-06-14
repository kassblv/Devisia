import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { defaultTiers } from "../../../data/pricing";

interface PricingPlan {
  id?: string;
  name: string;
  description: string;
  price: {
    monthly: number;
    yearly: number;
  };
  features: {
    name: string;
    description: string;
    included: boolean;
  }[];
  highlight?: boolean;
  badge?: string;
  icon?: React.ReactNode;
}

/**
 * GET /api/pricing
 * Récupère les plans d'abonnement actifs depuis la base de données
 * Si aucun plan n'existe en base, retourne les plans par défaut
 */
export async function GET() {
  try {
    // Récupérer les plans actifs depuis la DB
    const plans = await db.subscriptionPlan.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        price: "asc"
      }
    });
    
    // S'il n'y a pas de plans en DB, utiliser les plans par défaut
    if (plans.length === 0) {
      return NextResponse.json(defaultTiers);
    }
    
    // Formater les plans pour le frontend
    const formattedPlans = plans.map((plan: any) => {
      // Transformer les features de JSON string à objet
      const features = JSON.parse(plan.features);
      
      return {
        id: plan.id,
        name: plan.name,
        description: plan.description,
        price: {
          monthly: plan.interval === "MONTHLY" ? Number(plan.price) : null,
          yearly: plan.interval === "YEARLY" ? Number(plan.price) : null
        },
        features: features,
        maxQuotes: plan.maxQuotes,
        maxClients: plan.maxClients,
        highlight: plan.name === "Entreprise", // On met en évidence le plan intermédiaire par défaut
        badge: plan.name === "Entreprise" ? "Le plus populaire" : "",
        icon: null // L'icône sera ajouté côté client
      };
    });
    
    return NextResponse.json(formattedPlans);
  } catch (error) {
    console.error("Erreur lors de la récupération des plans d'abonnement:", error);
    return NextResponse.json(defaultTiers);
  }
}

/**
 * POST /api/pricing/sync
 * Synchronise les plans par défaut avec la base de données
 */
export async function POST() {
  try {
    // Pour chaque plan par défaut, on vérifie s'il existe déjà en DB
    // Si non, on le crée
    const createdPlans = [];
    
    for (const tier of defaultTiers) {
      const existingPlan = await db.subscriptionPlan.findFirst({
        where: {
          name: tier.name
        }
      });
      
      if (!existingPlan) {
        // Préparation des features pour stockage en JSON
        const features = tier.features.map(feature => ({
          title: feature.name,
          included: feature.included
        }));
        
        // Création du plan dans la DB
        const newPlan = await db.subscriptionPlan.create({
          data: {
            name: tier.name,
            description: tier.description,
            price: tier.price.monthly, // On prend le prix mensuel par défaut
            interval: "MONTHLY",
            features: JSON.stringify(features),
            isActive: true,
            maxQuotes: tier.name === "Artisan" ? 10 : 0, // 0 signifie illimité
            maxClients: tier.name === "Artisan" ? 1 : tier.name === "Entreprise" ? 5 : 0
          }
        });
        
        createdPlans.push(newPlan);
      }
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `${createdPlans.length} plans ont été synchronisés` 
    });
  } catch (error) {
    console.error("Erreur lors de la synchronisation des plans:", error);
    return NextResponse.json({ 
      success: false,
      error: "Erreur lors de la synchronisation des plans" 
    }, { status: 500 });
  }
}
