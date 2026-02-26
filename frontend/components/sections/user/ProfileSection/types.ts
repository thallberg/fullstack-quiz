export interface ProfileFormState {
  username: string;
  email: string;
}

export type ValidateProfileResult =
  | { success: false; message: string }
  | { success: "noChanges"; message: string }
  | { success: true; data: ProfileFormState };