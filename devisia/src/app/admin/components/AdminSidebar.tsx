"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  Users,
  Quote,
  CreditCard,
  Settings,
  Home,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Utilisateurs",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Devis",
    href: "/admin/quotes",
    icon: Quote,
  },
  {
    title: "Abonnements",
    href: "/admin/subscriptions",
    icon: CreditCard,
  },
  {
    title: "Paramètres",
    href: "/admin/settings",
    icon: Settings,
  },
  {
    title: "Site principal",
    href: "/",
    icon: Home,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();
  
  // Déterminer si un item est actif (correspondance exacte ou pour sous-chemin)
  const isActiveLink = (href: string) => {
    if (href === "/admin" && pathname === "/admin") {
      return true;
    }
    
    if (href !== "/admin" && pathname.startsWith(href)) {
      return true;
    }
    
    return false;
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-white h-screen sticky top-0 py-6">
      <div className="px-6 mb-6">
        <h2 className="text-xl font-bold">Devisia Admin</h2>
        <p className="text-sm text-gray-500">Gestion du site</p>
      </div>
      
      <nav className="flex-1 px-3 space-y-1">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
              isActiveLink(item.href)
                ? "bg-blue-50 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
      
      <div className="px-6 pt-6 border-t mt-auto">
        <div className="text-sm text-gray-500">
          <p>Version 1.0.0</p>
        </div>
      </div>
    </aside>
  );
}
