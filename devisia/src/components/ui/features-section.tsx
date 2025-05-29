"use client";

import { PenLine, Settings, Rocket } from "lucide-react";
import { AnimatedCard } from "@/components/ui/animated-card";

export function FeaturesSection() {
  return (
    <section id="fonctionnalites" className="py-20 ">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-5">
            Fonctionnalités conçues pour accélérer votre succès
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Découvrez les outils qui vous permettront de créer des devis professionnels en quelques minutes et d'augmenter vos taux de conversion.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <AnimatedCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface FeatureItem {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const features: FeatureItem[] = [
  {
    icon: PenLine,
    title: "Éditeur intuitif",
    description: "Notre interface glisser-déposer vous permet de personnaliser chaque aspect de vos devis sans compétences techniques."
  },
  {
    icon: Rocket,
    title: "IA Avancée",
    description: "L'intelligence artificielle génère des devis professionnels adaptés à votre secteur d'activité en quelques secondes."
  },
  {
    icon: Settings,
    title: "Personnalisation complète",
    description: "Adaptez tous les éléments à votre charte graphique pour une cohérence parfaite avec votre image de marque."
  },

];
