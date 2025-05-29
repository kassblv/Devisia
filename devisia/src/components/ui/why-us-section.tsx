"use client";

import { Button } from "@/components/ui/button";
import { HoverEffect } from "@/components/ui/hover-effect";
import { Check } from "lucide-react";

export function WhyUsSection() {
  return (
    <section id="pourquoi-nous" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-16">
          {/* Section gauche - Texte et arguments clés */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Pourquoi les professionnels choisissent <span className="text-primary-600">Devisia</span>
            </h2>
            
            <p className="text-lg text-gray-700 mb-8">
              Notre plateforme est conçue pour simplifier et optimiser votre processus de création de devis, vous faisant gagner du temps et augmentant votre taux de conversion.
            </p>
            
            <div className="space-y-5 mb-10">
              {advantages.map((advantage, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center mt-0.5">
                    <Check className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{advantage.title}</h3>
                    <p className="text-gray-700">{advantage.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <Button size="lg" className="mt-6">
              Démarrer gratuitement
            </Button>
          </div>
          
          {/* Section droite - Cards avec effet de hover inspiré d'Aceternity */}
          <div className="w-full lg:w-1/2 mt-12 lg:mt-0">
            <HoverEffect items={testimonials} className="grid grid-cols-1 md:grid-cols-2 gap-4" />
          </div>
        </div>
      </div>
    </section>
  );
}

const advantages = [
  {
    title: "Gain de temps considérable",
    description: "Créez des devis professionnels en minutes plutôt qu'en heures."
  },
  {
    title: "Professionnalisme accru",
    description: "Impressionnez vos clients avec des documents soignés et personnalisés."
  },
  {
    title: "Suivi en temps réel",
    description: "Suivez quand vos clients consultent vos devis et ce qui retient leur attention."
  },
  {
    title: "Plus de conversions",
    description: "Les utilisateurs constatent une augmentation moyenne de 35% de leurs taux d'acceptation."
  }
];

const testimonials = [
  {
    title: "Sophie D.",
    description: "Architecte d'intérieur",
    content: "Devisia a transformé ma façon de travailler. J'économise des heures chaque semaine sur l'administratif.",
    href: "#"
  },
  {
    title: "Marc L.",
    description: "Consultant indépendant",
    content: "Mes prospects apprécient la clarté et le professionnalisme de mes devis. Mon taux de conversion a augmenté de 40%.",
    href: "#"
  },
  {
    title: "Julie M.",
    description: "Agence de communication",
    content: "L'intégration avec notre CRM nous fait gagner un temps précieux et évite les erreurs de saisie.",
    href: "#"
  },
  {
    title: "Thomas B.",
    description: "Entrepreneur BTP",
    content: "Interface intuitive, options flexibles et support client réactif. Je recommande vivement.",
    href: "#"
  }
];
