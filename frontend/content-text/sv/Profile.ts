export const PROFILE_TEXT = {
    fields: {
      username: 'Användarnamn',
      email: 'E-post',
    },
  
    buttons: {
      edit: 'Redigera profil',
      save: 'Spara',
      cancel: 'Avbryt',
      logout: 'Logga ut',
    },
  
    validation: {
      required: 'Användarnamn och e-post är obligatoriska',
      invalidEmail: 'E-postadressen är inte giltig',
      noChanges: 'Inga ändringar gjordes.',
    },
  
    messages: {
      updated: 'Profil uppdaterad!',
      updateError: 'Kunde inte uppdatera profil',
      emailExists:
        'E-postadressen är redan registrerad. Använd en annan e-post.',
    },
  } as const;