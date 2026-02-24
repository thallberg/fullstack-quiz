import { CHANGE_PASSWORD_TEXT } from "@/constant/sv/ChangePassword";

export type ChangePasswordValues = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  
  export type ValidationResult =
    | { success: true }
    | { success: false; message: string };
  
  export function validateChangePassword(
    values: ChangePasswordValues
  ): ValidationResult {
    const { currentPassword, newPassword, confirmPassword } = values;
  
    if (!currentPassword.trim()) {
      return { success: false, message: CHANGE_PASSWORD_TEXT.validation.requiredCurrent };
    }
  
    if (!newPassword.trim()) {
      return { success: false, message: CHANGE_PASSWORD_TEXT.validation.requiredNew };
    }
  
    if (newPassword.length < 6) {
      return { success: false, message: CHANGE_PASSWORD_TEXT.validation.minLength };
    }
  
    if (newPassword !== confirmPassword) {
      return { success: false, message: CHANGE_PASSWORD_TEXT.validation.mismatch };
    }
  
    return { success: true };
  }