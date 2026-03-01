type AuthErrors = {
  loginFailed: string;
  registerFailed: string;
  invalidCredentials: string;
  emailInvalid: string;
  loginFailedGeneric: string;
  emailExists: string;
  usernameUnavailable: string;
  registerFailedGeneric: string;
};

export function parseAuthError(
  err: unknown,
  isLogin: boolean,
  AUTH_ERRORS: AuthErrors
): string {
  const errorMessage =
    err instanceof Error
      ? err.message
      : isLogin
        ? AUTH_ERRORS.loginFailed
        : AUTH_ERRORS.registerFailed;

  if (isLogin) {
    if (
      errorMessage.includes("Invalid email or password") ||
      errorMessage.includes("401")
    ) {
      return AUTH_ERRORS.invalidCredentials;
    }
    if (errorMessage.includes("Email")) {
      return AUTH_ERRORS.emailInvalid;
    }
    return errorMessage || AUTH_ERRORS.loginFailedGeneric;
  }

  if (
    errorMessage.includes("Email already exists") ||
    errorMessage.includes("already exists")
  ) {
    return AUTH_ERRORS.emailExists;
  }
  if (errorMessage.includes("Email")) {
    return AUTH_ERRORS.emailInvalid;
  }
  if (errorMessage.includes("Username")) {
    return AUTH_ERRORS.usernameUnavailable;
  }
  return errorMessage || AUTH_ERRORS.registerFailedGeneric;
}
