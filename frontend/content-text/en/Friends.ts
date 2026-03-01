export const FRIENDS_TEXT = {
    pendingInvites: {
      title: 'New friend request',
      accept: 'Accept',
      decline: 'Decline',
    },

    invite: {
      title: 'Invite friend',
      label: 'Email address',
      placeholder: 'friend@email.com',
      button: 'Send invitation',
      validation: {
        required: 'Email is required',
        invalid: 'Email address is not valid',
      },
      messages: {
        sent: (email: string) => `Invitation sent to ${email}`,
        genericError: 'Could not send invitation',
      },
    },

    friendsList: {
      title: 'My friends',
      empty: "You don't have any friends yet. Invite someone to get started!",
      since: 'Friends since',
      remove: 'Remove friend',
    },

    loading: 'Loading friends...',

    errors: {
      load: 'Could not load friends',
      remove: 'Could not remove friend',
      accept: 'Could not accept invitation',
      decline: 'Could not decline invitation',
    },

    dialog: {
      title: 'Remove friend',
      confirm: 'Remove',
      cancel: 'Cancel',
      message: (name: string) =>
        `Are you sure you want to remove "${name}" from your friends list?`,
    },
  } as const;
