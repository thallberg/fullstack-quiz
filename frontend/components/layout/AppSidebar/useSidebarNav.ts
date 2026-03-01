"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useSidebar } from "@/components/ui/sidebar"
import { useSidebarNavConfig, type NavItem } from "./sidebar.navConfig"

export interface MenuItem extends NavItem {
  isActive: boolean
}

export function useSidebarNav() {
  const { isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const { isMobile, setOpenMobile } = useSidebar()
  const { authenticatedNavItems, guestNavItems } = useSidebarNavConfig()

  const baseItems = isAuthenticated ? authenticatedNavItems : guestNavItems
  const menuItems: MenuItem[] = baseItems.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }))

  const handleLinkClick = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [isMobile, setOpenMobile])

  const handleLogout = React.useCallback(() => {
    logout()
    router.push("/")
  }, [logout, router])

  return { menuItems, handleLinkClick, handleLogout }
}
