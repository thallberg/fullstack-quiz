import { PROFILE_TEXT } from "@/content-text/sv/Profile";
import { ValidateProfileResult } from "./types";

interface Params {
  username: string;
  email: string;
  originalUsername: string;
  originalEmail: string;
}

export function validateProfile({
  username,
  email,
  originalUsername,
  originalEmail,
}: Params): ValidateProfileResult {
  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim();

  if (!trimmedUsername || !trimmedEmail) {
    return {
      success: false,
      message: PROFILE_TEXT.validation.required,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return {
      success: false,
      message: PROFILE_TEXT.validation.invalidEmail,
    };
  }

  if (
    trimmedUsername === originalUsername &&
    trimmedEmail === originalEmail
  ) {
    return {
      success: "noChanges",
      message: PROFILE_TEXT.validation.noChanges,
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