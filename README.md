# Quiz Next 🎯

En fullstack-applikation för quiz, byggd med **ASP.NET Core** som backend och **Next.js** som frontend.  
Projektet är uppdelat enligt clean architecture-principer med tydlig separation mellan ansvar.

---

## 📁 Projektstruktur

Projektet består av två huvudsakliga delar: backend-API och frontend-applikation.

```txt
Quiz-Next/
├── backend/                 # ASP.NET Core Web API (C#)
│   ├── Controllers/         # HTTP-endpoints
│   ├── Services/            # Affärslogik
│   ├── Repositories/        # Dataåtkomst
│   ├── Models/              # Databasentiteter
│   └── DTOs/                # Data Transfer Objects
│
└── frontend/                # Next.js-applikation (TypeScript / React)
    ├── app/                 # Next.js App Router-sidor
    ├── components/          # Återanvändbara React-komponenter
    ├── contexts/            # React contexts (auth, state)
    ├── lib/                 # API-klienter och utilities
    └── types/               # Delade TypeScript-typer

Databas & Lagring

Applikationen stödjer både databasbaserad lagring och in-memory-lagring för utveckling och testning.

{
  "Storage": {
    "Type": "Database"
  }
}


{
  "Storage": {
    "Type": "Memory"
  }
}
