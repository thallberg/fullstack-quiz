"use client"

import { useState, useCallback } from "react"
import { usePathname } from "next/navigation"

export function useNavigationMenu() {
  const pathname = usePathname()
  const [openMenuPathname, setOpenMenuPathname] = useState<string | null>(null)

  const isMobileMenuOpen = openMenuPathname === pathname

  const toggleMobileMenu = useCallback(() => {
    setOpenMenuPathname((prev) => (prev === pathname ? null : pathname))
  }, [pathname])

  const closeMobileMenu = useCallback(() => {
    setOpenMenuPathname(null)
  }, [])

  return { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu }
}
