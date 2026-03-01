"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useFriendshipNotifications } from "@/hooks/useFriendshipNotifications"
import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { AppSidebarHeader } from "./AppSidebarHeader"
import { AppSidebarNav } from "./AppSidebarNav"
import { AppSidebarProfile } from "./AppSidebarProfile"
import { useSidebarNav } from "./useSidebarNav"

export function AppSidebar() {
  const { isAuthenticated, user } = useAuth()
  const pathname = usePathname()
  const { hasPendingInvites } = useFriendshipNotifications()
  const { menuItems, handleLinkClick, handleLogout } = useSidebarNav()

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <AppSidebarHeader username={user?.username} />
      <SidebarContent>
        <AppSidebarNav menuItems={menuItems} onLinkClick={handleLinkClick} />
      </SidebarContent>
      {isAuthenticated && user && (
        <AppSidebarProfile
          username={user.username}
          pathname={pathname}
          hasPendingInvites={hasPendingInvites}
          onLinkClick={handleLinkClick}
          onLogout={handleLogout}
        />
      )}
    </Sidebar>
  )
}
