type InviteValidation = {
  required: string;
  invalid: string;
};

export function validateInviteEmail(
  email: string,
  validation: InviteValidation
) {
  if (!email.trim()) {
    return {
      success: false,
      message: validation.required,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return {
      success: false,
      message: validation.invalid,
    };
  }

  return { success: true };
}
