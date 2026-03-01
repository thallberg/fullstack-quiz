"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { useContent } from "@/contexts/LocaleContext"
import { useNavigationNavConfig } from "./navigation.navConfig"
import { NavigationNavLink } from "./NavigationNavLink"

interface NavigationDesktopActionsProps {
  pathname: string
  isAuthenticated: boolean
  username?: string | null
  hasPendingInvites: boolean
  onToggleMobileMenu: () => void
  isMobileMenuOpen: boolean
}

export function NavigationDesktopActions({
  pathname,
  isAuthenticated,
  username,
  hasPendingInvites,
  onToggleMobileMenu,
  isMobileMenuOpen,
}: NavigationDesktopActionsProps) {
  const { NAV_TEXT } = useContent()
  const { profileNavItem, guestAuthItems } = useNavigationNavConfig()

  return (
    <div className="flex items-center space-x-4">
      {isAuthenticated ? (
        <>
          <span className="text-sm sm:text-base text-white font-medium">
            {NAV_TEXT.greeting}, <span className="font-bold text-white">{username}</span>
          </span>
          <NavigationNavLink
            href={profileNavItem.url}
            isActive={pathname === profileNavItem.url}
            variant="desktop"
            showNotificationBadge={hasPendingInvites}
            className="hidden md:block"
          >
            {profileNavItem.title}
          </NavigationNavLink>
        </>
      ) : (
        <>
          <Link href={guestAuthItems[0].url} className="hidden md:block">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 border-white text-white hover:bg-white/30"
            >
              {guestAuthItems[0].title}
            </Button>
          </Link>
          <Link href={guestAuthItems[1].url} className="hidden md:block">
            <Button
              variant="secondary"
              size="sm"
              className="bg-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/80 text-[var(--color-purple)] font-bold"
            >
              {guestAuthItems[1].title}
            </Button>
          </Link>
        </>
      )}

      <button
        onClick={onToggleMobileMenu}
        className="md:hidden text-white hover:text-yellow-200 transition-colors p-2 cursor-pointer"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
    </div>
  )
}
