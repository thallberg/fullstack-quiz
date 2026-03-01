export type ChangePasswordValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

export type ValidationResult =
  | { success: true }
  | { success: false; message: string };

type ChangePasswordValidation = {
  requiredCurrent: string;
  requiredNew: string;
  minLength: string;
  mismatch: string;
};

export function validateChangePassword(
  values: ChangePasswordValues,
  validation: ChangePasswordValidation
): ValidationResult {
  const { currentPassword, newPassword, confirmPassword } = values;

  if (!currentPassword.trim()) {
    return { success: false, message: validation.requiredCurrent };
  }

  if (!newPassword.trim()) {
    return { success: false, message: validation.requiredNew };
  }

  if (newPassword.length < 6) {
    return { success: false, message: validation.minLength };
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: validation.mismatch };
  }

  return { success: true };
}
