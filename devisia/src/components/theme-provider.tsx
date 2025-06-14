"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ReactNode, useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: ReactNode }) {
  // État pour gérer le chargement initial et éviter le flash de contenu
  const [mounted, setMounted] = useState(false);
  
  // Effet qui s'exécute uniquement côté client
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Nous retournons directement les enfants sans div enveloppant pendant le montage
  // pour éviter des problèmes de structure HTML, surtout dans les layouts racine
  if (!mounted) {
    return (
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        storageKey="theme"
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    );
  }

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      storageKey="theme"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
