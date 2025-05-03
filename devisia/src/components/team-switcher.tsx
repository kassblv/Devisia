"use client"

import * as React from "react"
import { type LucideIcon, ChevronDown } from "lucide-react"

import {
  SidebarGroup,
  SidebarMenuButton,
} from "@/components/ui/sidebar"

// Interface pour les données d'équipe
interface Team {
  name: string
  logo: LucideIcon
  plan?: string
}

interface TeamSwitcherProps {
  teams: Team[]
}

export function TeamSwitcher({ teams }: TeamSwitcherProps) {
  const [currentTeam] = React.useState(teams[0])
  
  return (
    <div className="p-2">
      <SidebarMenuButton 
        variant="default" 
        className="w-full justify-between p-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground">
            {currentTeam.logo && <currentTeam.logo className="h-4 w-4" />}
          </div>
          <span className="text-base font-medium">{currentTeam.name}</span>
        </div>
        {teams.length > 1 && <ChevronDown className="h-4 w-4 opacity-50" />}
      </SidebarMenuButton>
    </div>
  )
}
