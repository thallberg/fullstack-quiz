export const CHANGE_PASSWORD_TEXT = {
  labels: {
    currentPassword: 'Nuvarande lösenord',
    newPassword: 'Nytt lösenord',
    confirmPassword: 'Bekräfta nytt lösenord',
  },
  placeholders: {
    currentPassword: 'Ditt nuvarande lösenord',
    newPassword: 'Minst 6 tecken',
    confirmPassword: 'Bekräfta lösenordet',
  },
  validation: {
    requiredCurrent: 'Nuvarande lösenord är obligatoriskt',
    requiredNew: 'Nytt lösenord är obligatoriskt',
    minLength: 'Lösenordet måste vara minst 6 tecken',
    mismatch: 'Lösenorden matchar inte',
  },
  messages: {
    success: 'Lösenord ändrat!',
    invalidCurrent: 'Nuvarande lösenord är felaktigt.',
    genericError: 'Kunde inte ändra lösenord',
  },
  button: 'Ändra lösenord',
} as const;