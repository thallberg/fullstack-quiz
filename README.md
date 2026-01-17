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

## ⚙️ Storage-konfiguration

### Backend Storage

Applikationen stödjer både databasbaserad lagring och in-memory-lagring för utveckling och testning.

I `backend/appsettings.json`:

```json
{
  "Storage": {
    "Type": "Database"  // eller "Memory"
  }
}
```

**Database**: Använder PostgreSQL (kräver databas-installation)  
**Memory**: Använder in-memory storage (data försvinner vid omstart)

### Frontend Storage

Frontend kan antingen använda riktig backend API eller localStorage för statiska deployment (t.ex. Vercel).

I `frontend/config.ts` eller via miljövariabel:

```typescript
// I frontend/config.ts - ändra denna rad:
export const STORAGE_TYPE = 'API';  // eller 'LocalStorage'
```

**API**: Använder riktig backend API (kräver att backend körs)  
**LocalStorage**: Använder browser localStorage (perfekt för Vercel/statiska deployment)

**Via miljövariabel** (för Vercel):
```env
NEXT_PUBLIC_STORAGE_TYPE=LocalStorage
```

**När ska du använda vad?**
- **Backend: Database + Frontend: API** = Fullstack med persisterad data (produktion)
- **Backend: Memory + Frontend: API** = Utveckling med backend
- **Frontend: LocalStorage** = Statisk deployment utan backend (t.ex. Vercel)


