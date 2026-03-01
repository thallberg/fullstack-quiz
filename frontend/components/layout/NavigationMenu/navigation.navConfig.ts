"use client";

import { useMemo } from "react";
import { useContent } from "@/contexts/LocaleContext";

export interface NavItem {
  title: string;
  url: string;
}

export function useNavigationNavConfig() {
  const { NAV_TEXT } = useContent();
  return useMemo(
    () => ({
      mainNavItems: [
        { title: NAV_TEXT.allQuizzesAlt, url: "/quizzes" },
        { title: NAV_TEXT.createQuiz, url: "/create" },
        { title: NAV_TEXT.leaderboard, url: "/leaderboard" },
      ] as NavItem[],
      profileNavItem: { title: NAV_TEXT.profile, url: "/profile" } as NavItem,
      guestAuthItems: [
        { title: NAV_TEXT.login, url: "/login" },
        { title: NAV_TEXT.register, url: "/register" },
      ] as NavItem[],
    }),
    [NAV_TEXT]
  );
}
