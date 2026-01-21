"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useFriendshipNotifications } from "@/hooks/useFriendshipNotifications"
import {
  Home,
  PlusCircle,
  Trophy,
  User,
  LogIn,
  UserPlus,
  Settings,
  CreditCard,
  ChevronDown,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuBadge,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/Button"

export function AppSidebar() {
  const { isAuthenticated, user, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const { hasPendingInvites } = useFriendshipNotifications()
  const [isProfileOpen, setIsProfileOpen] = React.useState(true)
  const { isMobile, setOpenMobile } = useSidebar()

  // Handler to close sidebar on mobile when clicking a link
  const handleLinkClick = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile(false)
    }
  }, [isMobile, setOpenMobile])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const menuItems = isAuthenticated
    ? [
        {
          title: "Alla Quiz",
          url: "/",
          icon: Home,
          isActive: pathname === "/",
        },
        {
          title: "Skapa Quiz",
          url: "/create",
          icon: PlusCircle,
          isActive: pathname === "/create",
        },
        {
          title: "Leaderboard",
          url: "/leaderboard",
          icon: Trophy,
          isActive: pathname === "/leaderboard",
        },
      ]
    : [
        {
          title: "Logga in",
          url: "/login",
          icon: LogIn,
          isActive: pathname === "/login",
        },
        {
          title: "Registrera",
          url: "/register",
          icon: UserPlus,
          isActive: pathname === "/register",
        },
      ]

  return (
    <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
      <SidebarHeader>
        {isAuthenticated && user && (
          <div className="flex items-center gap-2 w-full">
            <span className="text-sm text-white/90">
              Hej, <span className="font-bold">{user.username}</span>
            </span>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={item.isActive}
                    tooltip={item.title}
                  >
                    <Link href={item.url} onClick={handleLinkClick}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      {isAuthenticated && user && (
        <SidebarFooter>
          <SidebarGroup>
            {/* Profile Header - Always Visible */}
            <div className="px-2 py-3">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity group"
              >
                {/* Avatar with ring */}
                <div className="relative flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-purple)] to-[var(--color-pink)] text-white font-semibold text-base ring-2 ring-gray-300 group-hover:ring-gray-400 transition-all">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>
                {/* Username */}
                <span className="text-sm font-bold text-gray-900 truncate flex-1">
                  {user.username}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-gray-600 transition-transform duration-200 flex-shrink-0 ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </div>
            
            {isProfileOpen && (
              <SidebarGroupContent>
                <SidebarMenu>
                  {/* Profile Links */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/profile"}
                      tooltip="Min Profil"
                    >
                      <Link href="/profile" onClick={handleLinkClick}>
                        <User className="h-4 w-4" />
                        <span>Min Profil</span>
                        {hasPendingInvites && (
                          <SidebarMenuBadge className="bg-[var(--color-red)] text-white">
                            !
                          </SidebarMenuBadge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/account"}
                      tooltip="Konto"
                    >
                      <Link href="/account" onClick={handleLinkClick}>
                        <CreditCard className="h-4 w-4" />
                        <span>Konto</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === "/settings"}
                      tooltip="Inställningar"
                    >
                      <Link href="/settings" onClick={handleLinkClick}>
                        <Settings className="h-4 w-4" />
                        <span>Inställningar</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {/* Logout */}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      onClick={handleLogout}
                      className="w-full text-gray-900 hover:bg-gray-100"
                    >
                      <span>Logga ut</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            )}
          </SidebarGroup>
        </SidebarFooter>
      )}
    </Sidebar>
  )
}
