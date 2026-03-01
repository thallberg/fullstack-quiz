"use client"

import Link from "next/link"
import { ReactNode } from "react"

interface NavigationNavLinkProps {
  href: string
  isActive: boolean
  onClick?: () => void
  variant: "desktop" | "mobile"
  children: ReactNode
  showNotificationBadge?: boolean
  className?: string
}

const desktopClasses = (isActive: boolean) =>
  `relative text-white hover:text-yellow-200 transition-colors duration-200 font-medium px-2 py-1 ${
    isActive ? "text-yellow-200" : ""
  }`

const desktopUnderlineClasses = (isActive: boolean) =>
  `absolute bottom-0 left-0 w-full h-0.5 bg-yellow-200 transition-all duration-300 ${
    isActive ? "opacity-100" : "opacity-0 hover:opacity-100"
  }`

const notificationBadgeDesktop =
  "absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-[var(--color-red)] text-white rounded-full text-xs font-bold animate-pulse"
const notificationBadgeMobile =
  "absolute top-3 right-6 flex items-center justify-center w-5 h-5 bg-[var(--color-red)] text-white rounded-full text-xs font-bold animate-pulse"

const mobileClasses = (isActive: boolean) =>
  `px-6 py-4 text-lg font-medium text-white hover:bg-white/10 transition-colors border-b border-white/10 ${
    isActive ? "bg-white/20 text-yellow-200" : ""
  }`

export function NavigationNavLink({
  href,
  isActive,
  onClick,
  variant,
  children,
  showNotificationBadge,
  className = "",
}: NavigationNavLinkProps) {
  const isDesktop = variant === "desktop"
  const badgeClass = isDesktop ? notificationBadgeDesktop : notificationBadgeMobile

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${isDesktop ? desktopClasses(isActive) : mobileClasses(isActive)} ${
        showNotificationBadge ? "relative" : ""
      } ${className}`}
    >
      {children}
      {showNotificationBadge && (
        <span className={badgeClass}>!</span>
      )}
      {isDesktop && (
        <span className={desktopUnderlineClasses(isActive)} aria-hidden />
      )}
    </Link>
  )
}
