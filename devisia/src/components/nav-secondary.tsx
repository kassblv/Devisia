"use client"

import * as React from "react"
import { type Icon } from "@tabler/icons-react"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: Icon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname()
  
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item, index) => {
            const isActive = pathname === item.url
            
            return (
              <SidebarMenuItem key={item.title} className="isolation-isolate">
                <SidebarMenuButton asChild isActive={isActive}>
                  <a href={item.url} className={`menu-item-${index}`}>
                    <item.icon className={`transition-colors duration-normal ${isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-muted-foreground hover:text-sidebar-accent-foreground'}`} />
                    <span className={`transition-colors duration-normal ${isActive ? 'text-sidebar-accent-foreground' : 'text-sidebar-muted-foreground hover:text-sidebar-accent-foreground'}`}>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
