'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { cn } from '@/lib/utils'

const navigationLinks = [
    { name: 'Fonctionnalités', href: '#fonctionnalites' },
    { name: 'À propos', href: '#about' },
    { name: 'Tarifs', href: '#pricing' },
    { name: 'FAQ', href: '#faq' },
]



const Logo = ({ className, isScrolled }: { className?: string, isScrolled?: boolean }) => {
    return (
        <div className={cn('flex items-center gap-2', className)}>
            {isScrolled ? (
                <img 
                    src="/logos/logo_icone.png" 
                    alt="Devisia Icon" 
                    className="h-8 transition-all duration-300" 
                />
            ) : (
                <img 
                    src="/logos/logo_type+icone.png" 
                    alt="Devisia Logo" 
                    className="h-8 transition-all duration-300" 
                />
            )}
        </div>
    )
}


export function HeroHeader() {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)

    // Fonction pour gérer le défilement fluide
    const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault()
        
        // Fermer le menu mobile si ouvert
        if (menuState) {
            setMenuState(false)
        }
        
        // Extraire l'ID de la section à partir du href
        const targetId = href.replace('#', '')
        
        // Si c'est juste '#' (accueil), défiler vers le haut de la page
        if (!targetId) {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
            return
        }
        
        const targetElement = document.getElementById(targetId)
        
        if (targetElement) {
            // Calculer la position de défilement en tenant compte de la hauteur du header
            const headerOffset = 80 // Ajuster selon la hauteur de votre header
            const elementPosition = targetElement.getBoundingClientRect().top
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            })
        }
    }

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2 group">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Logo isScrolled={isScrolled} />
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {navigationLinks.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            onClick={(e) => handleSmoothScroll(e, item.href)}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {navigationLinks.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                onClick={(e) => handleSmoothScroll(e, item.href)}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                
                                <Link href="/auth/login">
                                  <button className={cn(!isScrolled ? 'lg:inline-flex' : 'hidden',"px-4 py-2 sm:px-3 text-xs sm:text-sm border border-ui-focus-gray bg-ui-dark/60 text-ui-light-gray rounded-full hover:border-ui-light-gray/50 hover:text-ui-light-gray transition-colors duration-200 w-full sm:w-auto")}>
                                    Connexion
                                  </button>
                                </Link> 
                                
  
                                <div className="relative group w-full sm:w-auto">
       <div className="absolute inset-0 -m-2 rounded-full
                     hidden sm:block
                     bg-ui-light-gray
                     opacity-40 filter blur-lg pointer-events-none
                     transition-all duration-300 ease-out
                     group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"></div>
       <Link href="/auth/register">
         <button className={cn("lg:inline-flex relative z-10 px-4 py-2 sm:px-3 text-xs sm:text-sm font-semibold text-ui-dark bg-gradient-to-br from-ui-light-gray to-ui-silver rounded-full hover:from-ui-light-gray hover:to-ui-silver transition-all duration-200 w-full sm:w-auto")}>
           Créer un devis
         </button>
       </Link>
    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
