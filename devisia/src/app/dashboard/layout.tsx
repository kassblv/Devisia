"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";

// Importation des composants shadcn
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// Importation des icônes Lucide
import { Home, FileText, Users, Settings, LogOut, Menu } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navigation = [
    { name: "Tableau de bord", href: "/dashboard", icon: <Home className="h-5 w-5" /> },
    { name: "Devis", href: "/dashboard/quotes", icon: <FileText className="h-5 w-5" /> },
    { name: "Clients", href: "/dashboard/clients", icon: <Users className="h-5 w-5" /> },
    { name: "Paramètres", href: "/dashboard/settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const SidebarNav = () => (
    <>
      <SidebarHeader className="h-16 border-b px-4">
        <div className="flex items-center h-full">
          <span className="font-bold text-xl text-primary">Devisia</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <SidebarMenu>
            {navigation.map((item) => (
              <SidebarMenuButton
                key={item.name}
                asChild
                isActive={pathname === item.href}
              >
                <Link href={item.href} className="flex items-center gap-2">
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          <span>Se déconnecter</span>
        </Button>
      </SidebarFooter>
    </>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex flex-col">
        {/* Mobile Nav */}
        <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Ouvrir le menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 border-r p-0">
              <ScrollArea className="h-full">
                <SidebarNav />
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="flex-1 flex justify-center">
            <span className="font-bold text-primary">Devisia</span>
          </div>
        </header>

        <div className="flex flex-1">
          {/* Desktop Sidebar */}
          <Sidebar className="hidden lg:block border-r w-64 flex-shrink-0">
            <SidebarNav />
          </Sidebar>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <div className="py-6 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
