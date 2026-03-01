export const AUTH_FORM_TEXT = {
  login: {
    title: "Logga in",
    submitLabel: "Logga in",
    linkText: "Registrera här",
    footerText: "Har du inget konto?",
  },
  register: {
    title: "Registrera",
    submitLabel: "Registrera",
    linkText: "Logga in här",
    footerText: "Har du redan ett konto?",
  },
} as const

export const AUTH_FIELDS_TEXT = {
  username: {
    label: "Användarnamn",
    placeholder: "Ditt användarnamn",
  },
  email: {
    label: "E-post",
    placeholder: "din@epost.se",
  },
  password: {
    label: "Lösenord",
    placeholderLogin: "Ditt lösenord",
    placeholderRegister: "Minst 6 tecken",
  },
  confirmPassword: {
    label: "Bekräfta lösenord",
    placeholder: "Bekräfta lösenordet",
  },
} as const

export const AUTH_VALIDATION = {
  emailRequired: "E-post är obligatorisk",
  emailInvalid: "E-postadressen är inte giltig",
  passwordRequired: "Lösenord är obligatoriskt",
  usernameRequired: "Användarnamn är obligatoriskt",
  usernameMinLength: "Användarnamn måste vara minst 3 tecken",
  passwordMinLength: "Lösenordet måste vara minst 6 tecken",
  confirmPasswordRequired: "Bekräfta lösenord är obligatoriskt",
  passwordsMismatch: "Lösenorden matchar inte",
} as const

export const AUTH_ERRORS = {
  loginFailed: "Inloggning misslyckades",
  registerFailed: "Registrering misslyckades",
  invalidCredentials:
    "Fel e-post eller lösenord. Kontrollera dina uppgifter och försök igen.",
  emailInvalid: "E-postadressen är inte giltig.",
  loginFailedGeneric:
    "Inloggning misslyckades. Kontrollera dina uppgifter och försök igen.",
  emailExists:
    "E-postadressen är redan registrerad. Använd en annan e-post eller logga in.",
  usernameUnavailable: "Användarnamnet är inte tillgängligt.",
  registerFailedGeneric:
    "Registrering misslyckades. Kontrollera dina uppgifter och försök igen.",
} as const
