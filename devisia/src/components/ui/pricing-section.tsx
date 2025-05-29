import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

export function PricingSection() {
  return (
    <section id="tarifs" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
            Des tarifs simples et transparents
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Choisissez le forfait qui correspond à vos besoins. Tous nos forfaits incluent un essai gratuit de 14 jours.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <PricingCard 
              key={index} 
              {...plan} 
              isPopular={index === 1}
            />
          ))}
        </div>
        
        <div className="mt-16 text-center text-gray-700">
          <p>Vous avez besoin d'un plan personnalisé pour votre entreprise?</p>
          <Button variant="link" className="text-primary-600 font-medium">
            Contactez notre équipe commerciale
          </Button>
        </div>
      </div>
    </section>
  );
}

interface PricingPlan {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
}

function PricingCard({ name, price, description, features, buttonText, isPopular }: PricingPlan & { isPopular?: boolean }) {
  return (
    <Card className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${isPopular ? 'border-primary-500 shadow-lg ring-2 ring-primary-500 ring-opacity-25' : 'border-gray-200'}`}>
      {isPopular && (
        <div className="absolute top-0 right-0">
          <Badge className="rounded-tl-none rounded-tr-sm rounded-br-none rounded-bl-sm m-0 py-1 px-3 bg-primary-500 text-white">
            Populaire
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-0">
        <CardTitle className="text-xl font-bold">{name}</CardTitle>
        <div className="mt-4 mb-2">
          <span className="text-4xl font-bold">{price}</span>
          {price !== 'Gratuit' && <span className="text-gray-500 ml-2">/mois</span>}
        </div>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <ul className="space-y-3">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                <Check className="h-3 w-3 text-primary-600" />
              </div>
              <span className="text-gray-700">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      
      <CardFooter>
        <Button 
          variant={isPopular ? "default" : "outline"}
          className="w-full"
        >
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Starter",
    price: "Gratuit",
    description: "Parfait pour démarrer et tester la solution",
    features: [
      "Jusqu'à 5 devis par mois",
      "1 modèle personnalisable",
      "Exports PDF",
      "Suivi de base"
    ],
    buttonText: "Commencer gratuitement"
  },
  {
    name: "Professionnel",
    price: "29€",
    description: "Idéal pour les freelances et petites entreprises",
    features: [
      "Devis illimités",
      "5 modèles personnalisables",
      "Intégration de paiement",
      "Suivi avancé et analytics",
      "Signature électronique",
      "Support prioritaire"
    ],
    buttonText: "Essayer 14 jours gratuits"
  },
  {
    name: "Entreprise",
    price: "79€",
    description: "Pour les équipes et les entreprises en croissance",
    features: [
      "Tout ce qui est inclus dans Pro",
      "Utilisateurs illimités",
      "Modèles illimités",
      "API complète",
      "Intégrations avancées",
      "Support dédié"
    ],
    buttonText: "Essayer 14 jours gratuits"
  }
];
