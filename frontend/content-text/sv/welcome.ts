
export interface WelcomeStep {
  title: string;
  description: string;
  borderClass: string;
  gradientClass: string;
  button?: {
    label: string;
    href: string;
    variant: "primary" | "secondary";
  };
  list?: string[];
}

export interface WelcomeData {
  header: {
    title: string;
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

  steps: WelcomeStep[];

  footerButtons: {
    label: string;
    href: string;
    variant: "primary" | "secondary" | "outline";
  }[];
}

export const WELCOME_DATA: WelcomeData = {
  header: {
    title: "Välkommen till Quiz App! 🎯",
    subtitle:
      "Skapa, spela och dela quiz med andra användare",
  },

  about: {
    title: "Vad är Quiz App?",
    description:
      "Quiz App är en plattform där du kan skapa egna quiz med ja/nej-frågor och utmana dig själv eller andra användare. Testa dina kunskaper, skapa roliga utmaningar eller använd det för utbildning!",
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
      title: "Registrera dig",
      description:
        "Skapa ett konto genom att ange användarnamn, e-post och lösenord. Det tar bara några sekunder!",
      borderClass:
        "border-[var(--color-blue)]/50",
      gradientClass:
        "from-[var(--color-blue)] to-[var(--color-cyan)]",
      button: {
        label: "Gå till registrering →",
        href: "/register",
        variant: "primary",
      },
    },
    {
      title: "Logga in",
      description:
        "Efter registrering kan du logga in med din e-post och lösenord för att komma åt alla funktioner.",
      borderClass:
        "border-[var(--color-purple)]/50",
      gradientClass:
        "from-[var(--color-purple)] to-[var(--color-pink)]",
      button: {
        label: "Gå till inloggning →",
        href: "/login",
        variant: "secondary",
      },
    },
    {
      title: "Börja spela och skapa quiz",
      description: "När du är inloggad kan du:",
      borderClass:
        "border-[var(--color-green)]/50",
      gradientClass:
        "from-[var(--color-green)] to-[var(--color-emerald)]",
      list: [
        "Spela quiz skapade av andra användare",
        "Skapa dina egna quiz med valfritt antal frågor",
        "Redigera och ta bort dina egna quiz",
        "Se resultat när du spelar quiz",
      ],
    },
  ],

  footerButtons: [
    {
      label: "Registrera dig nu",
      href: "/register",
      variant: "primary",
    },
    {
      label: "Jag har redan ett konto",
      href: "/login",
      variant: "outline",
    },
  ],
};