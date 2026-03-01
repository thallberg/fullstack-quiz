
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
    title: "Welcome to Quiz App! 🎯",
    subtitle:
      "Create, play and share quizzes with other users",
  },

  about: {
    title: "What is Quiz App?",
    description:
      "Quiz App is a platform where you can create your own yes/no quizzes and challenge yourself or other users. Test your knowledge, create fun challenges or use it for learning!",
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
      title: "Register",
      description:
        "Create an account by entering your username, email and password. It only takes a few seconds!",
      borderClass:
        "border-[var(--color-blue)]/50",
      gradientClass:
        "from-[var(--color-blue)] to-[var(--color-cyan)]",
      button: {
        label: "Go to registration →",
        href: "/register",
        variant: "primary",
      },
    },
    {
      title: "Log in",
      description:
        "After registering you can log in with your email and password to access all features.",
      borderClass:
        "border-[var(--color-purple)]/50",
      gradientClass:
        "from-[var(--color-purple)] to-[var(--color-pink)]",
      button: {
        label: "Go to login →",
        href: "/login",
        variant: "secondary",
      },
    },
    {
      title: "Start playing and creating quizzes",
      description: "When you're logged in you can:",
      borderClass:
        "border-[var(--color-green)]/50",
      gradientClass:
        "from-[var(--color-green)] to-[var(--color-emerald)]",
      list: [
        "Play quizzes created by other users",
        "Create your own quizzes with any number of questions",
        "Edit and delete your own quizzes",
        "See results when you play quizzes",
      ],
    },
  ],

  footerButtons: [
    {
      label: "Register now",
      href: "/register",
      variant: "primary",
    },
    {
      label: "I already have an account",
      href: "/login",
      variant: "outline",
    },
  ],
};
