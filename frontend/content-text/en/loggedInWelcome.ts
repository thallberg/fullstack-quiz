import type { ButtonProps } from "@/components/ui/Button";

export interface LoggedInStep {
  title: string;
  description: string;
  borderClass: string;
  gradientClass: string;
  button?: {
    label: string;
    href: string;
    variant: ButtonProps["variant"];
  };
  list?: string[];
  extraButtons?: {
    label: string;
    href: string;
    variant: ButtonProps["variant"];
    size?: ButtonProps["size"];
  }[];
}

export interface LoggedInWelcomeData {
  header: {
    subtitle: string;
  };
  about: {
    title: string;
    description: string;
    badges: {
      label: string;
      variant: "info" | "success" | "warning" | "default";
    }[];
  };
  stepsTitle: string;
  steps: LoggedInStep[];
  footerButtons: {
    label: string;
    href: string;
    variant: ButtonProps["variant"];
  }[];
}

export const welcomeBack = (username: string) =>
  "Welcome back, " + username + "! 🎯";

export const LOGGED_IN_WELCOME_DATA: LoggedInWelcomeData = {
  header: {
    subtitle: "Create, play and share quizzes with other users",
  },

  about: {
    title: "What can you do?",
    description:
      "Quiz App is your platform for creating your own yes/no quizzes and challenging yourself or other users.",
    badges: [
      { label: "Create quizzes", variant: "info" },
      { label: "Play quizzes", variant: "success" },
      { label: "Share with others", variant: "warning" },
      { label: "Yes/No questions", variant: "default" },
    ],
  },

  stepsTitle: "Get started - Step by step",

  steps: [
    {
      title: "Explore quizzes",
      description:
        "Browse all available quizzes and play them to test your knowledge.",
      borderClass: "border-[var(--color-blue)]/50",
      gradientClass: "from-[var(--color-blue)] to-[var(--color-cyan)]",
      button: {
        label: "See all quizzes →",
        href: "/quizzes",
        variant: "primary",
      },
    },
    {
      title: "Create your first quiz",
      description:
        "Create your own quiz with any number of yes/no questions.",
      borderClass: "border-[var(--color-purple)]/50",
      gradientClass: "from-[var(--color-purple)] to-[var(--color-pink)]",
      button: {
        label: "Create quiz →",
        href: "/create",
        variant: "secondary",
      },
    },
    {
      title: "Explore more features",
      description: "When you're ready you can:",
      borderClass: "border-[var(--color-green)]/50",
      gradientClass: "from-[var(--color-green)] to-[var(--color-emerald)]",
      list: [
        "View your leaderboard and compare results",
        "Manage your quizzes in your profile",
        "Add friends and challenge them",
        "Edit and delete your own quizzes",
      ],
      extraButtons: [
        {
          label: "Leaderboard",
          href: "/leaderboard",
          variant: "outline",
          size: "sm",
        },
        {
          label: "My Profile",
          href: "/profile",
          variant: "outline",
          size: "sm",
        },
      ],
    },
  ],

  footerButtons: [
    {
      label: "Create new quiz",
      href: "/create",
      variant: "primary",
    },
    {
      label: "Explore quizzes",
      href: "/quizzes",
      variant: "outline",
    },
  ],
};
