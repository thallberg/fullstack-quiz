import { ValidateProfileResult } from "./types";

type ProfileValidation = {
  required: string;
  invalidEmail: string;
  noChanges: string;
};

interface Params {
  username: string;
  email: string;
  originalUsername: string;
  originalEmail: string;
}

export function validateProfile(
  {
    username,
    email,
    originalUsername,
    originalEmail,
  }: Params,
  validation: ProfileValidation
): ValidateProfileResult {
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim();

  if (!trimmedUsername || !trimmedEmail) {
    return {
      success: false,
      message: validation.required,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return {
      success: false,
      message: validation.invalidEmail,
    };
  }

  if (
    trimmedUsername === originalUsername &&
    trimmedEmail === originalEmail
  ) {
    return {
      success: "noChanges",
      message: validation.noChanges,
    };
  }

  return {
    success: true,
    data: {
      username: trimmedUsername,
      email: trimmedEmail,
    },
  };
}
