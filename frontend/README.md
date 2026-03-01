# Quiz App Frontend

Next.js frontend för Quiz-applikationen.

## Struktur

```
frontend/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Huvudsida (välkomst)
│   ├── quizzes/            # Alla quiz-sida
│   ├── login/              # Login-sida
│   ├── register/           # Registrerings-sida
│   ├── create/             # Skapa quiz-sida
│   └── quiz/[id]/play/     # Spela quiz-sida
├── components/
│   ├── ui/                 # Bas-komponenter
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Label.tsx
│   │   ├── Checkbox.tsx
│   │   ├── Switch.tsx
│   │   ├── Card.tsx
│   │   ├── Divider.tsx
│   │   └── Badge.tsx
│   ├── sections/           # Sektions-komponenter
│   │   ├── CreateQuizSection.tsx
│   │   ├── QuizListSection.tsx
│   │   └── PlayQuizSection.tsx
│   ├── auth/               # Auth-komponenter (AuthForm, validation, etc.)
│   ├── NavigationMenu.tsx
│   └── ProtectedRoute.tsx
├── contexts/
│   └── AuthContext.tsx     # Auth state management
├── lib/
│   └── fetch/              # Fetch client modules
└── types/
    └── index.ts            # TypeScript types

```

## Komponenter

### Bas-komponenter (UI)
Alla bas-komponenter är generiska och återanvändbara:
- **Button** - Knapp med olika varianter (primary, secondary, danger, outline)
- **Input** - Textfält med validering
- **Textarea** - Textarea med validering
- **Label** - Etikett med stöd för required-markering
- **Checkbox** - Checkbox med label
- **Switch** - Toggle switch
- **Card** - Kort-komponent med header/body/footer
- **Divider** - Avdelare med valfritt text
- **Badge** - Badge med olika varianter

### Sektions-komponenter
- **CreateQuizSection** - Formulär för att skapa quiz med dynamiska frågor
- **QuizListSection** - Lista över alla quiz med actions
- **PlayQuizSection** - Spela quiz och få resultat

### Auth-komponenter
- **AuthForm** - Samlat formulär för login eller register (mode-prop)

## Fetch Client

Fetch-klienten (`lib/fetch/*`) hanterar all kommunikation med backend:
- Automatisk token-hantering
- Error handling
- Type-safe requests

## Auth Context

`AuthContext` hanterar autentisering:
- Login/Register/Logout
- Token storage i localStorage
- Protected routes

## Setup

1. Installera dependencies:
```bash
npm install
```

2. Skapa `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

3. Starta utvecklingsserver:
```bash
npm run dev
```

## Routes

- `/` - Huvudsida (välkomst)
- `/quizzes` - Alla quiz (kräver inloggning)
- `/login` - Logga in
- `/register` - Registrera
- `/create` - Skapa quiz (kräver inloggning)
- `/quiz/[id]/play` - Spela quiz
