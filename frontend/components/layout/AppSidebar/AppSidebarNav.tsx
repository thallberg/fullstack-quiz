"use client"

import Link from "next/link"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useContent } from "@/contexts/LocaleContext"
import type { MenuItem } from "./useSidebarNav"

interface AppSidebarNavProps {
  menuItems: MenuItem[]
  onLinkClick: () => void
}

export function AppSidebarNav({ menuItems, onLinkClick }: AppSidebarNavProps) {
  const { NAV_TEXT } = useContent()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{NAV_TEXT.navigation}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.url}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                tooltip={item.title}
              >
                <Link href={item.url} onClick={onLinkClick}>
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
