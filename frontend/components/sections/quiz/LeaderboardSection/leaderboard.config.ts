import type { LeaderboardDto } from "@/types";

export type LeaderboardKey = keyof LeaderboardDto;

export const LEADERBOARD_GROUPS: {
  key: LeaderboardKey;
  title: string;
  defaultOpen: boolean;
}[] = [
  { key: "myQuizzes", title: "Mina Quiz Leaderboard", defaultOpen: true },
  { key: "friendsQuizzes", title: "Vänners Quiz Leaderboard", defaultOpen: false },
  { key: "publicQuizzes", title: "Publika Quiz Leaderboard", defaultOpen: false },
];