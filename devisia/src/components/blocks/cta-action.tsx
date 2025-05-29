'use client';

import { WobbleCard } from '@/components/ui/wobble-card';
import { motion } from 'framer-motion';
import ActionButton from '@/components/ui/action-button';

export function CTASection() {
  return (
    <section id="contact" className='py-20'>
      <div className="container mx-auto px-4">
        {/* Utilisation du container pour limiter la largeur */}
        <WobbleCard
          containerClassName='max-w-8xl mx-auto bg-primary dark:bg-primary   shadow-lg border border-border'
          className=''
        >
          {/* Contenu adapté avec les couleurs du thème */}
          <div className="flex flex-col items-center justify-center px-4 py-12 sm:py-16">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-foreground text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Contactez-nous
            </motion.h2>
            
            <motion.p 
              className="text-lg sm:text-xl mb-8 text-muted-foreground max-w-4xl text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Contactez-nous pour obtenir un devis personnalisé et découvrir comment notre solution peut transformer votre processus de création de devis.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Utilisation du composant ActionButton avec la propriété href requise */}
              <ActionButton 
                href="#contact" 
                label="Contactez-nous"
              />
            </motion.div>
          </div>
        </WobbleCard>
      </div>
    </section>
  );
}
