"use client";

import { motion } from 'framer-motion';

export function TrustedLogos() {
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <h3 className="text-gray-800 text-sm font-semibold uppercase tracking-widest mb-2">
            Ils nous font confiance
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto"></div>
        </motion.div>

        <div className="relative overflow-hidden py-6">
          {/* Effet de halo/dégradé sur les côtés */}
          <div className="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-white to-transparent z-10"></div>
          <div className="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-white to-transparent z-10"></div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12">
            {logos.map((logo, index) => (
              <motion.a
                key={index}
                href={logo.url}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ y: -5, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group flex items-center justify-center h-16 mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className="max-h-full max-w-[120px] object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-md opacity-0 group-hover:opacity-10 bg-blue-500 transition-opacity duration-300"></div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const logos = [
  { src: "/images/logo-airbnb.svg", alt: "Airbnb", url: "https://airbnb.com" },
  { src: "/images/logo-microsoft.svg", alt: "Microsoft", url: "https://microsoft.com" },
  { src: "/images/logo-spotify.svg", alt: "Spotify", url: "https://spotify.com" },
  { src: "/images/logo-slack.svg", alt: "Slack", url: "https://slack.com" },
  { src: "/images/logo-amazon.svg", alt: "Amazon", url: "https://amazon.com" },
  { src: "/images/logo-shopify.svg", alt: "Shopify", url: "https://shopify.com" },
  { src: "/images/logo-google.svg", alt: "Google", url: "https://google.com" },
  { src: "/images/logo-netflix.svg", alt: "Netflix", url: "https://netflix.com" },
  { src: "/images/logo-salesforce.svg", alt: "Salesforce", url: "https://salesforce.com" },
  { src: "/images/logo-adobe.svg", alt: "Adobe", url: "https://adobe.com" },
  { src: "/images/logo-uber.svg", alt: "Uber", url: "https://uber.com" },
  { src: "/images/logo-stripe.svg", alt: "Stripe", url: "https://stripe.com" }
];
