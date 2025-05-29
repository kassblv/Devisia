import { Zap, ArrowDownToDot, Building, Wallet, Users } from "lucide-react";

export const defaultTiers = [
  {
    name: "Artisan",
    price: {
      monthly: 29,
      yearly: 290,
    },
    description: "Idéal pour les artisans indépendants",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-500/30 blur-2xl rounded-full" />
        <Zap className="w-7 h-7 relative z-10 text-blue-500 dark:text-blue-400 animate-[float_3s_ease-in-out_infinite]" />
      </div>
    ),
    features: [
      {
        name: "10 devis par mois",
        description: "Créez jusqu'à 10 devis assistés par IA",
        included: true,
      },
      {
        name: "1 utilisateur",
        description: "Accès pour un compte utilisateur",
        included: true,
      },
      {
        name: "Support par email",
        description: "Assistance sous 24h par email",
        included: true,
      },
      {
        name: "Export PDF & Word",
        description: "Exportez vos devis aux formats professionnels",
        included: true,
      },
    ],
  },
  {
    name: "Entreprise",
    price: {
      monthly: 79,
      yearly: 790,
    },
    description: "Pour les PME et entreprises du bâtiment",
    highlight: true,
    badge: "Le plus populaire",
    icon: (
      <div className="relative">
        <Building className="w-7 h-7 relative z-10 text-blue-600" />
      </div>
    ),
    features: [
      {
        name: "Devis illimités",
        description: "Créez autant de devis que nécessaire",
        included: true,
      },
      {
        name: "Jusqu'à 5 utilisateurs",
        description: "Accès pour toute votre équipe",
        included: true,
      },
      {
        name: "Support prioritaire",
        description: "Chat et email avec réponse sous 4h",
        included: true,
      },
      {
        name: "Analyse des coûts",
        description: "Optimisation automatique des prix et marges",
        included: true,
      },
    ],
  },
  {
    name: "Construction Pro",
    price: {
      monthly: 149,
      yearly: 1490,
    },
    description: "Solutions complètes pour les grandes entreprises",
    highlight: false,
    badge: "",
    icon: (
      <div className="relative">
        <Users className="w-7 h-7 relative z-10 text-blue-700" />
      </div>
    ),
    features: [
      {
        name: "Devis & factures illimités",
        description: "Suite complète de gestion des documents",
        included: true,
      },
      {
        name: "Utilisateurs illimités",
        description: "Pour les équipes de toutes tailles",
        included: true,
      },
      {
        name: "Support dédié",
        description: "Conseiller personnel et hotline 24/7",
        included: true,
      },
      {
        name: "Intégration complète",
        description: "API et connexion à vos logiciels existants",
        included: true,
      },
    ],
  },
];
