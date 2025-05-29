import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "lucide-react";

export function TestimonialsSection() {
  return (
    <section id="temoignages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-5">
            Ce que nos clients disent
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Découvrez comment Devisia a transformé la gestion des devis de nos clients et amélioré leurs résultats commerciaux.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface Testimonial {
  name: string;
  role: string;
  company: string;
  imgSrc?: string;
  rating: number;
  content: string;
}

function TestimonialCard({ name, role, company, imgSrc, rating, content }: Testimonial) {
  return (
    <div className="relative group">
      {/* Effet d'arrière-plan inspiré d'Aceternity */}
      <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-primary-200 to-secondary-200 opacity-0 blur-lg group-hover:opacity-100 transition-all duration-700"></div>
      
      <div className="relative bg-white p-6 rounded-lg border border-gray-200 shadow-sm transition-all duration-300 group-hover:shadow-lg">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={imgSrc} />
            <AvatarFallback className="bg-primary-100 text-primary-800">
              {name.split(' ').map(part => part[0]).join('')}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-700">{role}, {company}</p>
            <div className="flex mt-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon 
                  key={i} 
                  className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
          </div>
        </div>
        
        <blockquote className="italic text-gray-700">"{content}"</blockquote>
      </div>
    </div>
  );
}

const testimonials: Testimonial[] = [
  {
    name: "Marie Dubois",
    role: "Directrice marketing",
    company: "Studio Design",
    imgSrc: "/images/testimonial1.png",
    rating: 5,
    content: "Devisia a révolutionné notre processus de devis. Nous avons augmenté notre taux de conversion de 40% en seulement deux mois d'utilisation."
  },
  {
    name: "Thomas Laurent",
    role: "Consultant indépendant",
    company: "TL Conseil",
    imgSrc: "/images/testimonial2.png",
    rating: 5,
    content: "L'interface intuitive et les modèles professionnels m'ont permis de gagner des heures chaque semaine. Un investissement qui s'est rentabilisé en quelques semaines."
  },
  {
    name: "Julie Martin",
    role: "Fondatrice",
    company: "Agence Spark",
    imgSrc: "/images/testimonial3.png",
    rating: 4,
    content: "Les analyses détaillées m'ont aidée à comprendre quels aspects de mes devis fonctionnaient le mieux. Je peux désormais les optimiser pour maximiser mes chances."
  },
  {
    name: "Pierre Durand",
    role: "Architecte",
    company: "Studio PD",
    imgSrc: "/images/testimonial4.png",
    rating: 5,
    content: "Mes clients sont impressionnés par le professionnalisme de mes devis. La signature électronique a accéléré considérablement le processus d'approbation."
  },
  {
    name: "Sophie Leroy",
    role: "Responsable commercial",
    company: "Tech Solutions",
    imgSrc: "/images/testimonial5.png",
    rating: 5,
    content: "L'intégration avec notre CRM est parfaite. Toute notre équipe a adopté Devisia en quelques jours, c'est extrêmement simple à utiliser."
  },
  {
    name: "Marc Bernard",
    role: "Entrepreneur",
    company: "MB Construction",
    imgSrc: "/images/testimonial6.png",
    rating: 4,
    content: "Le support client est exceptionnel. Chaque fois que j'ai eu une question, l'équipe a répondu en quelques minutes avec des solutions claires."
  }
];
