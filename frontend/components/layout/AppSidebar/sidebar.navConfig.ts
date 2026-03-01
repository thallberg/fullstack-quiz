"use client";

import type { LucideIcon } from "lucide-react";
import { Home, List, PlusCircle, Trophy, LogIn, UserPlus } from "lucide-react";
import { useContent } from "@/contexts/LocaleContext";
import { useMemo } from "react";

export interface NavItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export function useSidebarNavConfig() {
  const { NAV_TEXT } = useContent();
  return useMemo(
    () => ({
      authenticatedNavItems: [
        { title: NAV_TEXT.home, url: "/", icon: Home },
        { title: NAV_TEXT.allQuizzes, url: "/quizzes", icon: List },
        { title: NAV_TEXT.createQuiz, url: "/create", icon: PlusCircle },
        { title: NAV_TEXT.leaderboard, url: "/leaderboard", icon: Trophy },
      ] as NavItem[],
      guestNavItems: [
        { title: NAV_TEXT.login, url: "/login", icon: LogIn },
        { title: NAV_TEXT.register, url: "/register", icon: UserPlus },
      ] as NavItem[],
    }),
    [NAV_TEXT]
  );
}
