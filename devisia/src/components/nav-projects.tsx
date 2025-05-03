"use client"

import { type LucideIcon } from "lucide-react"
import { usePathname } from "next/navigation"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

// Interface pour les projets
interface Project {
  name: string
  url: string
  icon: LucideIcon
}

interface NavProjectsProps {
  projects: Project[]
}

export function NavProjects({ projects }: NavProjectsProps) {
  const pathname = usePathname()
  
  // Si aucun projet n'est défini, ne rien afficher
  if (projects.length === 0) return null
  
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Projets récents</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((project) => {
          const isActive = pathname === project.url
          return (
            <SidebarMenuItem key={project.name}>
              <SidebarMenuButton 
                tooltip={project.name} 
                isActive={isActive} 
                asChild
              >
                <a href={project.url}>
                  {project.icon && <project.icon />}
                  <span>{project.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
