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
  `Välkommen tillbaka, ${username}! 🎯`;

export const LOGGED_IN_WELCOME_DATA: LoggedInWelcomeData = {
  header: {
    subtitle:
      "Skapa, spela och dela quiz med andra användare",
  },

  about: {
    title: "Vad kan du göra?",
    description:
      "Quiz App är din plattform för att skapa egna quiz med ja/nej-frågor och utmana dig själv eller andra användare.",
    badges: [
      { label: "Skapa quiz", variant: "info" },
      { label: "Spela quiz", variant: "success" },
      { label: "Dela med andra", variant: "warning" },
      { label: "Ja/Nej-frågor", variant: "default" },
    ],
  },

  stepsTitle: "Kom igång - Steg för steg",

  steps: [
    {
      title: "Utforska quiz",
      description:
        "Bläddra bland alla tillgängliga quiz och spela dem för att testa dina kunskaper.",
      borderClass: "border-[var(--color-blue)]/50",
      gradientClass:
        "from-[var(--color-blue)] to-[var(--color-cyan)]",
      button: {
        label: "Se alla quiz →",
        href: "/quizzes",
        variant: "primary",
      },
    },
    {
      title: "Skapa ditt första quiz",
      description:
        "Skapa ditt eget quiz med valfritt antal ja/nej-frågor.",
      borderClass:
        "border-[var(--color-purple)]/50",
      gradientClass:
        "from-[var(--color-purple)] to-[var(--color-pink)]",
      button: {
        label: "Skapa quiz →",
        href: "/create",
        variant: "secondary",
      },
    },
    {
      title: "Utforska mer funktioner",
      description: "När du är redo kan du:",
      borderClass:
        "border-[var(--color-green)]/50",
      gradientClass:
        "from-[var(--color-green)] to-[var(--color-emerald)]",
      list: [
        "Se din leaderboard och jämföra resultat",
        "Hantera dina quiz i din profil",
        "Lägga till vänner och utmana dem",
        "Redigera och ta bort dina egna quiz",
      ],
      extraButtons: [
        {
          label: "Leaderboard",
          href: "/leaderboard",
          variant: "outline",
          size: "sm",
        },
        {
          label: "Min Profil",
          href: "/profile",
          variant: "outline",
          size: "sm",
        },
      ],
    },
  ],

  footerButtons: [
    {
      label: "Skapa nytt quiz",
      href: "/create",
      variant: "primary",
    },
    {
      label: "Utforska quiz",
      href: "/quizzes",
      variant: "outline",
    },
  ],
};