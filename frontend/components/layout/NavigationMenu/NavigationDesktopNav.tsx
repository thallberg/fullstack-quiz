"use client"

import Link from "next/link"
import { useContent } from "@/contexts/LocaleContext"
import { useNavigationNavConfig } from "./navigation.navConfig"
import { NavigationNavLink } from "./NavigationNavLink"

interface NavigationDesktopNavProps {
  pathname: string
  isAuthenticated: boolean
}

export function NavigationDesktopNav({
  pathname,
  isAuthenticated,
}: NavigationDesktopNavProps) {
  const { NAV_TEXT } = useContent()
  const { mainNavItems } = useNavigationNavConfig()

  return (
    <div className="flex items-center space-x-8">
      <Link
        href="/"
        className="text-xl font-bold text-white hover:text-yellow-200 transition-colors drop-shadow-md"
      >
        {NAV_TEXT.appNameWithIcon}
      </Link>
      {isAuthenticated && (
        <div className="hidden md:flex items-center space-x-8">
          {mainNavItems.map((item) => (
            <NavigationNavLink
              key={item.url}
              href={item.url}
              isActive={pathname === item.url}
              variant="desktop"
            >
              {item.title}
            </NavigationNavLink>
          ))}
        </div>
      )}
    </div>
  )
}
