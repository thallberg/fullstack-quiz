/**
 * API base URL – samma backend som webbappen.
 * Lokal utveckling: använd t.ex. http://10.0.2.2:5xxx (Android-emulator)
 * eller din dators IP (t.ex. http://192.168.1.x:5xxx).
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  'https://full-quiz-c8b8ame9byhac9a2.westeurope-01.azurewebsites.net/api';
