"use client"

import * as React from "react"
import {
  IconChartBar,
  IconFileDescription,
  IconHelp,
  IconSettings,
  IconUsers,
  IconCreditCard,
  IconDashboard
} from "@tabler/icons-react"
import { useSession } from "next-auth/react"
import Image from "next/image"

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
      title: "Utilisateurs",
      url: "/admin/users",
      icon: IconUsers,
    },
    {
      title: "Devis",
      url: "/admin/quotes",
      icon: IconFileDescription,
    },
    {
      title: "Abonnements",
      url: "/admin/subscriptions",
      icon: IconCreditCard,
    },
  ],
  navSecondary: [
    {
      title: "Paramètres",
      url: "/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Site principal",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Aide",
      url: "#",
      icon: IconHelp,
    },
  ],
}

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
              <a href="/admin" className="flex items-center gap-2 transition-colors duration-normal">
                <Image 
                  src="/logos/logo_icone.png" 
                  alt="Devisia Logo"
                  width={24} 
                  height={24}
                  className="object-contain"
                />
                <span className="font-serif text-base font-semibold text-sidebar-accent-foreground">Devisia Admin</span>
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
