"use client";
import { animate, motion } from "framer-motion";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { PenLine, Settings, Rocket } from "lucide-react";

export function AnimatedCard({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: any;
}) {
  return (
    <Card>
      <CardSkeletonContainer>
        <IconAnimation icon={Icon} />
      </CardSkeletonContainer>
      <CardTitle>{title}</CardTitle>
      <CardDescription>
        {description}
      </CardDescription>
    </Card>
  );
}

const IconAnimation = ({ icon: Icon }: { icon: any }) => {
  return (
    <div className="p-8 overflow-hidden h-full relative flex items-center justify-center">
      {/* Cercle de fond avec glow */}
      <div className="absolute w-24 h-24 rounded-full bg-primary/5 animate-pulse" />
      
      {/* Icône animée */}
      <motion.div
        className="relative z-10"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, 0, -2, 0],
          y: [0, -4, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut"
        }}
      >
        <Container>
          <Icon className="h-8 w-8 text-primary" />
        </Container>
      </motion.div>

      {/* Particules qui volent autour */}
      <div className="absolute w-full h-full">
        <Sparkles count={15} />
      </div>
      
      {/* Effet lumineux */}
      <div className="absolute w-32 h-32 bg-gradient-to-br from-primary/20 to-transparent rounded-full opacity-70 animate-pulse blur-xl" />
    </div>
  );
};

const Sparkles = ({ count = 12 }: { count?: number }) => {
  return (
    <div className="absolute inset-0">
      {[...Array(count)].map((_, i) => {
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 3 + 2;
        const initialX = Math.random() * 100;
        const initialY = Math.random() * 100;
        
        return (
          <motion.span
            key={`star-${i}`}
            animate={{
              x: [
                `${initialX}%`, 
                `${initialX + (Math.random() * 20 - 10)}%`, 
                `${initialX}%`
              ],
              y: [
                `${initialY}%`, 
                `${initialY + (Math.random() * 20 - 10)}%`, 
                `${initialY}%`
              ],
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
            style={{
              position: "absolute",
              left: `${initialX}%`,
              top: `${initialY}%`,
              width: `${size}px`,
              height: `${size}px`,
            }}
            className="rounded-full bg-primary/80 blur-[0.5px]"
          />
        );
      })}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "max-w-sm w-full mx-auto p-8 rounded-xl border border-border bg-card/90 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 group",
        className
      )}
    >
      {children}
    </div>
  );
};

export const CardTitle = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <h3
      className={cn(
        "text-xl font-semibold text-foreground py-2",
        className
      )}
    >
      {children}
    </h3>
  );
};

export const CardDescription = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <p
      className={cn(
        "text-sm text-muted-foreground max-w-sm",
        className
      )}
    >
      {children}
    </p>
  );
};

export const CardSkeletonContainer = ({
  className,
  children,
  showGradient = true,
}: {
  className?: string;
  children: React.ReactNode;
  showGradient?: boolean;
}) => {
  return (
    <div
      className={cn(
        "h-[15rem] rounded-xl z-40",
        className,
        showGradient &&
          "bg-muted [mask-image:radial-gradient(50%_50%_at_50%_50%,white_0%,transparent_100%)]"
      )}
    >
      {children}
    </div>
  );
};

const Container = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        `h-16 w-16 rounded-full flex items-center justify-center bg-card shadow-md`,
        className
      )}
    >
      {children}
    </div>
  );
};
