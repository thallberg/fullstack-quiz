// API base URL – samma backend som webbappen.
// Sätt EXPO_PUBLIC_API_URL för lokal backend (t.ex. http://10.0.2.2:5xxx i emulator).
export const API_BASE_URL =
  (typeof process !== 'undefined' && (process as any).env?.EXPO_PUBLIC_API_URL) ||
  'https://full-quiz-c8b8ame9byhac9a2.westeurope-01.azurewebsites.net/api';

// Mobilappen använder alltid API (ingen lokal storage-läge som i webben).
export const USE_LOCAL_STORAGE = false;
