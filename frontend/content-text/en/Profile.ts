export const PROFILE_TEXT = {
    fields: {
      username: 'Username',
      email: 'Email',
    },

    buttons: {
      edit: 'Edit profile',
      save: 'Save',
      cancel: 'Cancel',
      logout: 'Log out',
    },

    validation: {
      required: 'Username and email are required',
      invalidEmail: 'Email address is not valid',
      noChanges: 'No changes were made.',
    },

    messages: {
      updated: 'Profile updated!',
      updateError: 'Could not update profile',
      emailExists:
        'This email is already registered. Use a different email.',
    },
  } as const;
