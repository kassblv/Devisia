import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 md:pt-36 md:pb-28 bg-gradient-to-b from-primary-50/50 to-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Formes décoratives subtiles */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-100/20 rounded-bl-[200px] -z-10"></div>
        <div className="absolute top-24 left-0 w-64 h-64 bg-secondary-100/20 rounded-full blur-3xl -z-10"></div>
        
        <div className="flex flex-col lg:flex-row items-center gap-12 relative">
          {/* Contenu textuel */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Simplifiez vos <span className="text-primary-600">devis</span> et
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500"> boostez</span> vos ventes
            </h1>
            
            <p className="text-lg text-gray-700 mb-8">
              Créez des devis professionnels en quelques minutes. Augmentez votre taux de conversion et développez votre activité.
            </p>
            
            {/* CTA principal */}
            <div className="mb-8 space-x-4">
              <Button size="lg">
                <Link href="/auth/register" className="flex items-center">
                  Essayer gratuitement
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                <Link href="#fonctionnalites">En savoir plus</Link>
              </Button>
            </div>
            
            {/* Points clés */}
            <div className="flex flex-col space-y-3 mb-8">
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary-600 mr-3" />
                <span className="text-gray-700">Configuration en 2 minutes</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary-600 mr-3" />
                <span className="text-gray-700">Aucune carte bancaire requise</span>
              </div>
              <div className="flex items-center">
                <Check className="w-5 h-5 text-primary-600 mr-3" />
                <span className="text-gray-700">Annulation facile à tout moment</span>
              </div>
            </div>
          </div>
          
          {/* Image principale */}
          <div className="w-full lg:w-1/2">
            <div className="relative bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl opacity-50"></div>
              <img 
                src="/images/dashboard-preview.png" 
                alt="Dashboard Devisia" 
                className="w-full h-auto relative z-10 rounded-lg"
              />
              
              {/* Badge statistiques */}
              <div className="absolute bottom-4 right-4 bg-white text-gray-900 p-3 rounded-lg shadow-md z-20 border border-gray-100">
                <div className="flex items-center gap-2">
                  <div className="text-primary-600 font-bold text-lg">+50%</div>
                  <div className="text-sm">de taux d'acceptation</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
