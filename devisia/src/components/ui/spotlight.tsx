"use client";

import { cn } from "@/lib/utils";
import { useMotionValue, useSpring, motion } from "framer-motion";
import React, { useEffect, useState } from "react";

export interface SpotlightProps {
  children?: React.ReactNode;
  className?: string;
  fill?: string;
}

export function Spotlight({
  children,
  className,
  fill = "white",
}: SpotlightProps) {
  const [isMounted, setIsMounted] = useState(false);
  
  // Position du spotlight
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Animation fluide du spotlight
  const springX = useSpring(mouseX, { damping: 25, stiffness: 100 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 100 });

  useEffect(() => {
    setIsMounted(true);
    
    // Fonction pour mettre à jour la position de la souris
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseX, mouseY]);

  // Déterminer la couleur du gradient en fonction de la prop fill
  const gradientColor = () => {
    switch (fill) {
      case "blue":
        return "from-blue-500 via-blue-400 to-transparent";
      case "purple":
        return "from-purple-500 via-purple-400 to-transparent";
      case "yellow":
        return "from-yellow-500 via-yellow-400 to-transparent";
      case "orange":
        return "from-orange-500 via-orange-400 to-transparent";
      case "green":
        return "from-green-500 via-green-400 to-transparent";
      case "red":
        return "from-red-500 via-red-400 to-transparent";
      default:
        return "from-white via-gray-200 to-transparent";
    }
  };

  if (!isMounted) return <>{children}</>;

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <motion.div
        className={cn(
          "pointer-events-none absolute -inset-px z-0 opacity-50 blur-3xl",
          `bg-gradient-radial ${gradientColor()}`
        )}
        style={{
          top: 0,
          left: 0,
          width: "60%",
          height: "60%",
          borderRadius: "50%",
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      />
      {children}
    </div>
  );
}
