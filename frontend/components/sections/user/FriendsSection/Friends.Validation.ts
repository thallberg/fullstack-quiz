import { FRIENDS_TEXT } from '@/content-text/sv/Friends';

export function validateInviteEmail(email: string) {
  if (!email.trim()) {
    return {
      success: false,
      message: FRIENDS_TEXT.invite.validation.required,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email.trim())) {
    return {
      success: false,
      message: FRIENDS_TEXT.invite.validation.invalid,
    };
  }

  return { success: true };
}