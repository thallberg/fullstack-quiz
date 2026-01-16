// Storage configuration - Change this ONE line to switch between API and LocalStorage
// true = Use LocalStorage (for Vercel/static deployment without backend)
// false = Use API (for local development with backend)
// 
// You can also set NEXT_PUBLIC_USE_LOCAL_STORAGE environment variable:
// - In Vercel: Set NEXT_PUBLIC_USE_LOCAL_STORAGE=true
// - Locally: Set NEXT_PUBLIC_USE_LOCAL_STORAGE=false or omit it
// 
// DEFAULT: Change the value below to switch
const DEFAULT_USE_LOCAL_STORAGE = true; // Change to false to use API

export const USE_LOCAL_STORAGE = process.env.NEXT_PUBLIC_USE_LOCAL_STORAGE === 'true' 
  ? true 
  : process.env.NEXT_PUBLIC_USE_LOCAL_STORAGE === 'false' 
    ? false 
    : DEFAULT_USE_LOCAL_STORAGE;
