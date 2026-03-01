"use client"

import * as React from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import {
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useContent } from "@/contexts/LocaleContext"
import { useSidebarProfileConfig } from "./sidebar.profileConfig"

interface AppSidebarProfileProps {
  username: string
  pathname: string
  hasPendingInvites: boolean
  onLinkClick: () => void
  onLogout: () => void
}

export function AppSidebarProfile({
  username,
  pathname,
  hasPendingInvites,
  onLinkClick,
  onLogout,
}: AppSidebarProfileProps) {
  const [isOpen, setIsOpen] = React.useState(true)
  const { NAV_TEXT } = useContent()
  const { profileNavItems } = useSidebarProfileConfig()

  return (
    <SidebarFooter>
      <SidebarGroup>
        <div className="px-2 py-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-3 w-full hover:opacity-80 transition-opacity group"
          >
            <div className="relative flex-shrink-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-purple)] to-[var(--color-pink)] text-white font-semibold text-base ring-2 ring-gray-300 group-hover:ring-gray-400 transition-all">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="text-sm font-bold text-gray-900 truncate flex-1">
              {username}
            </span>
            <ChevronDown
              className={`h-4 w-4 text-gray-600 transition-transform duration-200 flex-shrink-0 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {isOpen && (
          <SidebarGroupContent>
            <SidebarMenu>
              {profileNavItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link href={item.url} onClick={onLinkClick}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                      {item.url === "/profile" && hasPendingInvites && (
                        <SidebarMenuBadge className="bg-[var(--color-red)] text-white">
                          !
                        </SidebarMenuBadge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={onLogout}
                  className="w-full text-gray-900 hover:bg-gray-100"
                >
                  <span>{NAV_TEXT.logOut}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        )}
      </SidebarGroup>
    </SidebarFooter>
  )
}
