"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowRightIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Zap, ArrowDownToDot, Building, Users } from "lucide-react"

interface Feature {
  name: string
  description: string
  included: boolean
}

interface PricingTier {
  name: string
  price: {
    monthly: number
    yearly: number
  }
  description: string
  features: Feature[]
  highlight?: boolean
  badge?: string
  icon: React.ReactNode
}

interface PricingSectionProps {
  tiers: PricingTier[]
  className?: string
}

function PricingSection({ tiers: initialTiers, className }: PricingSectionProps) {
  const [isYearly, setIsYearly] = useState(false)
  const [tiers, setTiers] = useState(initialTiers)
  const [loading, setLoading] = useState(false)
  
  // Charger les plans d'abonnement depuis l'API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/pricing')
        
        if (response.ok) {
          const data = await response.json()
          // Ajouter les icônes aux plans
          const plansWithIcons = data.map((plan: any) => ({
            ...plan,
            icon: getIconForPlan(plan.name)
          }))
          setTiers(plansWithIcons)
        }
        
      } catch (error) {
        console.error('Erreur lors du chargement des plans:', error)
        // En cas d'erreur, on garde les plans par défaut
      } finally {
        setLoading(false)
      }
    }
    
    fetchPlans()
  }, [])
  
  // Fonction pour obtenir l'icône selon le nom du plan
  const getIconForPlan = (planName: string) => {
    switch (planName) {
      case 'Artisan':
        return (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-blue-500/30 blur-2xl rounded-full" />
            <Zap className="w-7 h-7 relative z-10 text-blue-500 dark:text-blue-400 animate-[float_3s_ease-in-out_infinite]" />
          </div>
        )
      case 'Entreprise':
        return (
          <div className="relative">
            <Building className="w-7 h-7 relative z-10 text-blue-600" />
          </div>
        )
      case 'Construction Pro':
        return (
          <div className="relative">
            <Users className="w-7 h-7 relative z-10 text-blue-700" />
          </div>
        )
      default:
        return (
          <div className="relative">
            <Users className="w-7 h-7 relative z-10 text-blue-500" />
          </div>
        )
    }
  }

  const buttonStyles = {
    default: cn(
      "h-12 bg-white dark:bg-zinc-900",
      "hover:bg-zinc-50 dark:hover:bg-zinc-800",
      "text-zinc-900 dark:text-zinc-100",
      "border border-zinc-200 dark:border-zinc-800",
      "hover:border-zinc-300 dark:hover:border-zinc-700",
      "shadow-sm hover:shadow-md",
      "text-sm font-medium",
    ),
    highlight: cn(
      "h-12 bg-zinc-900 dark:bg-zinc-100",
      "hover:bg-zinc-800 dark:hover:bg-zinc-300",
      "text-white dark:text-zinc-900",
      "shadow-[0_1px_15px_rgba(0,0,0,0.1)]",
      "hover:shadow-[0_1px_20px_rgba(0,0,0,0.15)]",
      "font-semibold text-base",
    ),
  }

  const badgeStyles = cn(
    "px-4 py-1.5 text-sm font-medium",
    "bg-zinc-900 dark:bg-zinc-100",
    "text-white dark:text-zinc-900",
    "border-none shadow-lg",
  )

  return (
    <section
      className={cn(
        "relative  text-foreground",
        "py-12 px-4 md:py-12 lg:py-24",
        "overflow-hidden",
        className,
      )}
    >
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col items-center gap-4 mb-12">
        <motion.h1
        className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 tracking-tight'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        {"Des prix transparents"}
      </motion.h1>
      <motion.p
        className='text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto'
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        {"Générez des devis professionnels en quelques minutes, avec des estimations précises et des descriptions détaillées grâce à notre IA."}
      </motion.p>
          <div className="inline-flex items-center p-1.5 bg-white dark:bg-zinc-800/50 rounded-full border border-zinc-200 dark:border-zinc-700 shadow-sm">
            {["Monthly", "Yearly"].map((period) => (
              <button
                key={period}
                onClick={() => setIsYearly(period === "Yearly")}
                className={cn(
                  "px-8 py-2.5 text-sm font-medium rounded-full transition-all duration-300",
                  (period === "Yearly") === isYearly
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 shadow-lg"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100",
                )}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative group backdrop-blur-sm",
                "rounded-3xl transition-all duration-300",
                "flex flex-col",
                tier.highlight
                  ? "bg-gradient-to-b from-zinc-100/80 to-transparent dark:from-zinc-400/[0.15]"
                  : "bg-white dark:bg-zinc-800/50",
                "border",
                tier.highlight
                  ? "border-zinc-400/50 dark:border-zinc-400/20 shadow-xl"
                  : "border-zinc-200 dark:border-zinc-700 shadow-md",
                "hover:translate-y-0 hover:shadow-lg",
              )}
            >
              {tier.badge && tier.highlight && (
                <div className="absolute -top-4 left-6">
                  <Badge className={badgeStyles}>{tier.badge}</Badge>
                </div>
              )}

              <div className="p-8 flex-1">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      tier.highlight
                        ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400",
                    )}
                  >
                    {tier.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                    {tier.name}
                  </h3>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
                      ${isYearly ? tier.price.yearly : tier.price.monthly}
                    </span>
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">
                      /{isYearly ? "year" : "month"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                    {tier.description}
                  </p>
                </div>

                <div className="space-y-4">
                  {tier.features.map((feature) => (
                    <div key={feature.name} className="flex gap-4">
                      <div
                        className={cn(
                          "mt-1 p-0.5 rounded-full transition-colors duration-200",
                          feature.included
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-zinc-400 dark:text-zinc-600",
                        )}
                      >
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                          {feature.name}
                        </div>
                        <div className="text-sm text-zinc-500 dark:text-zinc-400">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 pt-0 mt-auto">
                <Button
                  className={cn(
                    "w-full relative transition-all duration-300",
                    tier.highlight
                      ? buttonStyles.highlight
                      : buttonStyles.default,
                  )}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {tier.highlight ? (
                      <>
                        Buy now
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Get started
                        <ArrowRightIcon className="w-4 h-4" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export { PricingSection }