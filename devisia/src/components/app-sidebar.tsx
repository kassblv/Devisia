"use client"

import * as React from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import { useSession } from "next-auth/react"
import Image from "next/image"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  navMain: [
    {
      title: "Devis",
      url: "/dashboard/quotes",
      icon: IconFileDescription,
    },
    {
      title: "Clients",
      url: "/dashboard/clients",
      icon: IconUsers,
    },

  ],
  navClouds: [
    {
      title: "Devis",
      icon: IconFileDescription,
      isActive: true,
      url: "/dashboard/quotes",
      items: [
        {
          title: "Tous les devis",
          url: "/dashboard/quotes",
        },
        {
          title: "Nouveau devis",
          url: "/dashboard/quotes/new",
        },
      ],
    },
    {
      title: "Clients",
      icon: IconUsers,
      url: "/dashboard/clients",
      items: [
        {
          title: "Liste des clients",
          url: "/dashboard/clients",
        },
        {
          title: "Ajouter un client",
          url: "/dashboard/clients/new",
        },
      ],
    },

  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "/dashboard/settings",
      icon: IconSettings,
    },
    {
      title: "Aide",
      url: "#",
      icon: IconHelp,
    },

  ],

}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = useSession()
  
  return (
    <Sidebar 
      collapsible="offcanvas" 
      className="border-r border-sidebar-muted transition-all duration-normal" 
      {...props}
    >
      <SidebarHeader className="border-b border-sidebar-muted pb-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <a href="/dashboard" className="flex items-center gap-2 transition-colors duration-normal">
                <Image 
                  src="/logos/logo_icone.png" 
                  alt="Devisia Logo"
                  width={24} 
                  height={24}
                  className="object-contain"
                />
                <span className="font-serif text-base font-semibold text-sidebar-accent-foreground">Devisia</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="py-2">
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-muted pt-2">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
