"use client"

import { SidebarHeader } from "@/components/ui/sidebar"
import { useContent } from "@/contexts/LocaleContext"

interface AppSidebarHeaderProps {
  username?: string | null
}

export function AppSidebarHeader({ username }: AppSidebarHeaderProps) {
  const { NAV_TEXT } = useContent()

  return (
    <SidebarHeader>
      {username && (
        <div className="flex items-center gap-2 w-full">
          <span className="text-sm text-white/90">
            {NAV_TEXT.greeting}, <span className="font-bold">{username}</span>
          </span>
        </div>
      )}
    </SidebarHeader>
  )
}
