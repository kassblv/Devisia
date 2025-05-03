"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

import { cn } from "@/lib/utils";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

// Map des titres de pages pour le fil d'Ariane
const breadcrumbTitles: Record<string, string> = {
  "/dashboard": "Tableau de bord",
  "/dashboard/quotes": "Devis",
  "/dashboard/clients": "Clients",
  "/dashboard/settings": "Paramètres",
  "/dashboard/profile": "Profil",
};

// Fonction pour générer les chemins d'Ariane à partir d'un chemin
function getBreadcrumbsFromPath(path: string): { href: string; label: string }[] {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs: { href: string; label: string }[] = [];
  
  let currentPath = '';
  
  for (const segment of segments) {
    currentPath += `/${segment}`;
    const label = breadcrumbTitles[currentPath] || segment;
    breadcrumbs.push({ href: currentPath, label });
  }
  
  return breadcrumbs;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const breadcrumbs = getBreadcrumbsFromPath(pathname);
  
  // Détermine si nous sommes sur une page spécifique ou une sous-page
  const currentPage = breadcrumbs[breadcrumbs.length - 1];
  const parentPath = breadcrumbs.length > 1 ? breadcrumbs[breadcrumbs.length - 2] : null;
  
  return (
    <div className="h-screen w-full overflow-auto">
      <SidebarProvider>
        <div className="flex h-full w-full">
          {/* Sidebar qui reste à gauche */}
          <AppSidebar />
          
          {/* Contenu principal qui s'ajuste en fonction de la sidebar */}
          <SidebarInset className="flex flex-col flex-1 min-w-0 w-full">
            <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background z-10">
              <div className="flex items-center gap-2 px-4 w-full">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Breadcrumb>
                  <BreadcrumbList>
                    {parentPath && (
                      <>
                        <BreadcrumbItem className="hidden md:block">
                          <BreadcrumbLink href={parentPath.href}>
                            {parentPath.label}
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className="hidden md:block" />
                      </>
                    )}
                    <BreadcrumbItem>
                      <BreadcrumbPage>{currentPage.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <main className="flex flex-1 flex-col w-full h-full p-4 overflow-auto">
              <div className="flex flex-col flex-1 w-full h-full  mx-auto">
                {children}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
}
