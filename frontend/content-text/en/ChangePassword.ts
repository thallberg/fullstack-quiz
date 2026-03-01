export const CHANGE_PASSWORD_TEXT = {
  labels: {
    currentPassword: 'Current password',
    newPassword: 'New password',
    confirmPassword: 'Confirm new password',
  },
  placeholders: {
    currentPassword: 'Your current password',
    newPassword: 'At least 6 characters',
    confirmPassword: 'Confirm password',
  },
  validation: {
    requiredCurrent: 'Current password is required',
    requiredNew: 'New password is required',
    minLength: 'Password must be at least 6 characters',
    mismatch: 'Passwords do not match',
  },
  messages: {
    success: 'Password changed!',
    invalidCurrent: 'Current password is incorrect.',
    genericError: 'Could not change password',
  },
  button: 'Change password',
} as const;
