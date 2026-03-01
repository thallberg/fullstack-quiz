"use client"

import { usePathname } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useFriendshipNotifications } from "@/hooks/useFriendshipNotifications"
import { useNavigationMenu } from "./useNavigationMenu"
import { NavigationDesktopNav } from "./NavigationDesktopNav"
import { NavigationDesktopActions } from "./NavigationDesktopActions"
import { NavigationMobileMenu } from "./NavigationMobileMenu"

export function NavigationMenu() {
  const { isAuthenticated, user } = useAuth()
  const pathname = usePathname()
  const { hasPendingInvites } = useFriendshipNotifications()
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useNavigationMenu()

  return (
    <>
      <nav className="bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-purple)] to-[var(--color-pink)] shadow-lg border-b border-[var(--color-blue)]/40 relative z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <NavigationDesktopNav
              pathname={pathname}
              isAuthenticated={isAuthenticated}
            />
            <NavigationDesktopActions
              pathname={pathname}
              isAuthenticated={isAuthenticated}
              username={user?.username}
              hasPendingInvites={hasPendingInvites}
              onToggleMobileMenu={toggleMobileMenu}
              isMobileMenuOpen={isMobileMenuOpen}
            />
          </div>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <NavigationMobileMenu
          pathname={pathname}
          isAuthenticated={isAuthenticated}
          hasPendingInvites={hasPendingInvites}
          onClose={closeMobileMenu}
        />
      )}
    </>
  )
}
