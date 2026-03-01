export const AUTH_FORM_TEXT = {
  login: {
    title: "Log in",
    submitLabel: "Log in",
    linkText: "Register here",
    footerText: "Don't have an account?",
  },
  register: {
    title: "Register",
    submitLabel: "Register",
    linkText: "Log in here",
    footerText: "Already have an account?",
  },
} as const

export const AUTH_FIELDS_TEXT = {
  username: {
    label: "Username",
    placeholder: "Your username",
  },
  email: {
    label: "Email",
    placeholder: "you@email.com",
  },
  password: {
    label: "Password",
    placeholderLogin: "Your password",
    placeholderRegister: "At least 6 characters",
  },
  confirmPassword: {
    label: "Confirm password",
    placeholder: "Confirm password",
  },
} as const

export const AUTH_VALIDATION = {
  emailRequired: "Email is required",
  emailInvalid: "Email address is not valid",
  passwordRequired: "Password is required",
  usernameRequired: "Username is required",
  usernameMinLength: "Username must be at least 3 characters",
  passwordMinLength: "Password must be at least 6 characters",
  confirmPasswordRequired: "Confirm password is required",
  passwordsMismatch: "Passwords do not match",
} as const

export const AUTH_ERRORS = {
  loginFailed: "Login failed",
  registerFailed: "Registration failed",
  invalidCredentials:
    "Wrong email or password. Check your details and try again.",
  emailInvalid: "Email address is not valid.",
  loginFailedGeneric:
    "Login failed. Check your details and try again.",
  emailExists:
    "This email is already registered. Use a different email or log in.",
  usernameUnavailable: "Username is not available.",
  registerFailedGeneric:
    "Registration failed. Check your details and try again.",
} as const
