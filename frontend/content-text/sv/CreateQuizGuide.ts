export const CREATE_QUIZ_GUIDE_TEXT = {
    header: {
      title: 'Skapa ditt första Quiz! 🎯',
      subtitle: 'Det finns inga quiz ännu. Varför inte skapa det första?',
    },
  
    howItWorks: {
      title: 'Hur fungerar det?',
      description:
        'Skapa ditt eget quiz med ja/nej-frågor. Du kan lägga till så många frågor som du vill och ange rätt svar för varje fråga.',
      badges: [
        { label: 'Enkelt att skapa', variant: 'info' },
        { label: 'Obegränsat antal frågor', variant: 'success' },
        { label: 'Dela med andra', variant: 'warning' },
        { label: 'Ja/Nej-frågor', variant: 'default' },
      ] as const,
    },
  
    steps: {
      title: 'Steg för steg',
      items: [
        {
          title: 'Ge quizet en titel',
          description:
            'Välj en beskrivande titel som förklarar vad quizet handlar om.',
          gradient: 'from-[var(--color-orange)] to-[var(--color-yellow)]',
          border: 'border-[var(--color-orange)]/50',
        },
        {
          title: 'Lägg till frågor',
          description:
            'Lägg till så många frågor du vill. Varje fråga ska vara en ja/nej-fråga.',
          gradient: 'from-[var(--color-pink)] to-[var(--color-rose)]',
          border: 'border-[var(--color-pink)]/50',
        },
        {
          title: 'Välj rätt svar',
          description:
            'För varje fråga, välj om rätt svar är "Ja" eller "Nej".',
          gradient: 'from-[var(--color-teal)] to-[var(--color-cyan)]',
          border: 'border-[var(--color-teal)]/50',
        },
      ] as const,
    },
  
    button: 'Skapa mitt första quiz',
  } as const;