"use client"

import Link from "next/link"
import { Button } from "@/components/ui/Button"
import { useContent } from "@/contexts/LocaleContext"
import { useNavigationNavConfig } from "./navigation.navConfig"
import { NavigationNavLink } from "./NavigationNavLink"

interface NavigationMobileMenuProps {
  pathname: string
  isAuthenticated: boolean
  hasPendingInvites: boolean
  onClose: () => void
}

export function NavigationMobileMenu({
  pathname,
  isAuthenticated,
  hasPendingInvites,
  onClose,
}: NavigationMobileMenuProps) {
  const { NAV_TEXT } = useContent()
  const { mainNavItems, profileNavItem, guestAuthItems } = useNavigationNavConfig()

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 z-30 md:hidden"
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed inset-x-0 top-16 bg-gradient-to-r from-[var(--color-blue)] via-[var(--color-purple)] to-[var(--color-pink)] shadow-xl border-b border-[var(--color-blue)]/40 z-40 md:hidden"
        style={{ height: "calc(100vh - 4rem)" }}
        role="dialog"
        aria-label={NAV_TEXT.mobileMenuAria}
      >
        <div className="flex flex-col h-full w-full">
          {isAuthenticated ? (
            <div className="flex flex-col flex-1 overflow-y-auto pt-4">
              {mainNavItems.map((item) => (
                <NavigationNavLink
                  key={item.url}
                  href={item.url}
                  isActive={pathname === item.url}
                  onClick={onClose}
                  variant="mobile"
                >
                  {item.title}
                </NavigationNavLink>
              ))}
              <NavigationNavLink
                href={profileNavItem.url}
                isActive={pathname === profileNavItem.url}
                onClick={onClose}
                variant="mobile"
                showNotificationBadge={hasPendingInvites}
              >
                {profileNavItem.title}
              </NavigationNavLink>
            </div>
          ) : (
            <div className="flex flex-col flex-1 justify-center items-center space-y-4 px-6">
              <Link href={guestAuthItems[0].url} onClick={onClose} className="w-full">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full bg-white/20 border-white text-white hover:bg-white/30 text-lg py-3"
                >
                  {guestAuthItems[0].title}
                </Button>
              </Link>
              <Link href={guestAuthItems[1].url} onClick={onClose} className="w-full">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full bg-[var(--color-yellow)] hover:bg-[var(--color-yellow)]/80 text-[var(--color-purple)] font-bold text-lg py-3"
                >
                  {guestAuthItems[1].title}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
