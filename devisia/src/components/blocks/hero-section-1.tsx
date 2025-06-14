'use client'
import React from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronRight, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { InfiniteSlider } from '@/components/ui/infinite-slider'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import { HoverBorderGradient } from '../ui/hover-border-gradiant'

const transitionVariants = {
    item: {
        hidden: {
            opacity: 0,
            filter: 'blur(12px)',
            y: 12,
        },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: {
                type: 'spring',
                bounce: 0.3,
                duration: 1.5,
            },
        },
    },
}

export function HeroSection() {
    return (
        <>
                <div
                    aria-hidden
                    className="z-[2] overflow-hidden absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block">
                    <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-gradient-to-r from-ui-light-gray to-ui-dark" />
                    <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-gradient-to-r from-ui-light-gray to-ui-dark" />
                    <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-gradient-to-r from-ui-light-gray to-ui-dark" />
                </div>
                <section>
                    <div className="relative pt-24 md:pt-36">
                
                        <div aria-hidden className="absolute inset-0 -z-10 size-full bg-gradient-to-b from-transparent to-ui-light-gray" />
                        <div className="mx-auto max-w-7xl px-6">
                            <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
                                <AnimatedGroup variants={transitionVariants}>

                                    <Link
                                        href="#how-it-works"
                                        className="hover:bg-ui-light-gray dark:hover:border-ui-dark bg-ui-light-gray group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-ui-dark/5 transition-all duration-300 dark:border-ui-dark/5 dark:shadow-ui-dark">
                                        
                                        <span className="text-ui-dark text-sm">Propulsé par l'IA - Créez vos devis en quelques minutes</span>
                                        <span className="dark:border-ui-dark block h-4 w-0.5 border-l bg-ui-light-gray dark:bg-ui-dark"></span>

                                        <div className="bg-ui-light-gray group-hover:bg-ui-dark size-6 overflow-hidden rounded-full duration-500">
                                            <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                                <span className="flex size-6">
                                                    <ArrowRight className="m-auto size-3" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                        
                                    <h1
                                        className="mt-8 max-w-4xl mx-auto text-ui-dark text-6xl md:text-7xl lg:mt-16 xl:text-[5.25rem]">
                                        Générez des devis professionnels en quelques minutes
                                        
                                    </h1>
                                    <p
                                        className="mx-auto mt-6 max-w-2xl text-lg text-ui-dark lg:text-xl">
                                        Générez des devis professionnels en quelques minutes,
                                        avec des estimations précises et des descriptions détaillées grâce à notre IA.
                                    </p>
                                </AnimatedGroup>

                                <AnimatedGroup
                                    variants={{
                                        container: {
                                            visible: {
                                                transition: {
                                                    staggerChildren: 0.05,
                                                    delayChildren: 0.75,
                                                },
                                            },
                                        },
                                        ...transitionVariants,
                                    }}
                                    className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row">
             
                                  <Link href="/dashboard/quotes/new">
      <button className={'relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-ui-silver dark:focus:ring-ui-light-gray focus:ring-offset-2 focus:ring-offset-ui-light-gray dark:focus:ring-offset-ui-dark'}>
        <span className='absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-gradient-blue-primary' />
        <span className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-ui-light-gray dark:bg-ui-dark px-6 py-2 text-sm font-medium text-ui-dark dark:text-ui-light-gray backdrop-blur-3xl`}>
          Créer un devis
        </span>
      </button>
    </Link>
    <Link href="#features">
      <HoverBorderGradient
              containerClassName='rounded-full'
              as='button'
              className='text-ui-dark dark:text-ui-light-gray flex items-center justify-center text-sm sm:text-base px-5 py-2 sm:px-6 sm:py-3'
            >
              <span>Découvrir nos fonctionnalités</span>
      </HoverBorderGradient>
    </Link>
                               
                                </AnimatedGroup>
                            </div>
                        </div>

                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: {
                                        transition: {
                                            staggerChildren: 0.05,
                                            delayChildren: 0.75,
                                        },
                                    },
                                },
                                ...transitionVariants,
                            }}>
                            <div className="relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
                                <div
                                    aria-hidden
                                    className="bg-gradient-to-b to-ui-light-gray absolute inset-0 z-10 from-transparent from-35%"
                                />
                                <div className="inset-shadow-2xs ring-ui-light-gray dark:inset-shadow-ui-dark/20 bg-ui-light-gray relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-ui-dark/15 ring-1">
                                    <img
                                        className="bg-ui-light-gray aspect-15/8 relative hidden rounded-2xl dark:block"
                                        src="https://tailark.com//_next/image?url=%2Fmail2.png&w=3840&q=75"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                    <img
                                        className="z-2 border-ui-light-gray/25 aspect-15/8 relative rounded-2xl border dark:hidden"
                                        src="https://tailark.com/_next/image?url=%2Fmail2-light.png&w=3840&q=75"
                                        alt="app screen"
                                        width="2700"
                                        height="1440"
                                    />
                                </div>
                            </div>
                        </AnimatedGroup>
                    </div>
                </section>
                <section className="bg-ui-light-gray pb-16 pt-16 md:pb-32 ">
                   <LogoCloud />
                </section>
      
        </>
    )
}


const LogoCloud = () => {
    return (
        <section className="bg-ui-light-gray pb-16 md:pb-32">
            <div className="group relative m-auto max-w-6xl px-6">
                <div className="flex flex-col items-center md:flex-row">
                    <div className="inline md:max-w-44 md:border-r md:pr-6">
                        <p className="text-end text-sm">Nos collaborateurs qui nous font confiance</p>
                    </div>
                    <div className="relative py-6 md:w-[calc(100%-11rem)]">
                        <InfiniteSlider
                        durationOnHover={20}
                            duration={40}
                            gap={112}>
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/nvidia.svg"
                                    alt="Nvidia Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/column.svg"
                                    alt="Column Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/github.svg"
                                    alt="GitHub Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                      
                            <div className="flex">
                                <img
                                    className="mx-auto h-5 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lemonsqueezy.svg"
                                    alt="Lemon Squeezy Logo"
                                    height="20"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-4 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/laravel.svg"
                                    alt="Laravel Logo"
                                    height="16"
                                    width="auto"
                                />
                            </div>
                            <div className="flex">
                                <img
                                    className="mx-auto h-7 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/lilly.svg"
                                    alt="Lilly Logo"
                                    height="28"
                                    width="auto"
                                />
                            </div>

                            <div className="flex">
                                <img
                                    className="mx-auto h-6 w-fit dark:invert"
                                    src="https://html.tailus.io/blocks/customers/openai.svg"
                                    alt="OpenAI Logo"
                                    height="24"
                                    width="auto"
                                />
                            </div>
                        </InfiniteSlider>

                        <div className="bg-linear-to-r from-ui-light-gray absolute inset-y-0 left-0 w-20"></div>
                        <div className="bg-linear-to-l from-ui-light-gray absolute inset-y-0 right-0 w-20"></div>
                        <ProgressiveBlur
                            className="pointer-events-none absolute left-0 top-0 h-full w-20"
                            direction="left"
                            blurIntensity={1}
                        />
                        <ProgressiveBlur
                            className="pointer-events-none absolute right-0 top-0 h-full w-20"
                            direction="right"
                            blurIntensity={1}
                        />
                    </div>
                </div>
            </div>
        </section>
    )
}