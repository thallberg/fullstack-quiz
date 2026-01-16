// Storage configuration - Change "Storage:Type" to "API" or "LocalStorage"
// "API" = Use real backend API (requires backend server)
// "LocalStorage" = Use browser localStorage (for static deployments like Vercel)
export const STORAGE_TYPE = process.env.NEXT_PUBLIC_STORAGE_TYPE || 'LocalStorage';
