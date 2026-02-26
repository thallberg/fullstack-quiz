export const FRIENDS_TEXT = {
    pendingInvites: {
      title: 'Ny väninbjudan',
      accept: 'Acceptera',
      decline: 'Avböj',
    },
  
    invite: {
      title: 'Bjud in vän',
      label: 'E-postadress',
      placeholder: 'van@epost.se',
      button: 'Skicka inbjudan',
      validation: {
        required: 'E-post är obligatorisk',
        invalid: 'E-postadressen är inte giltig',
      },
      messages: {
        sent: (email: string) => `Inbjudan skickad till ${email}`,
        genericError: 'Kunde inte skicka inbjudan',
      },
    },
  
    friendsList: {
      title: 'Mina vänner',
      empty: 'Du har inga vänner ännu. Bjud in någon för att komma igång!',
      since: 'Vänner sedan',
      remove: 'Ta bort vän',
    },
  
    loading: 'Laddar vänner...',
  
    errors: {
      load: 'Kunde inte ladda vänner',
      remove: 'Kunde inte ta bort vän',
      accept: 'Kunde inte acceptera inbjudan',
      decline: 'Kunde inte avböja inbjudan',
    },
  
    dialog: {
      title: 'Ta bort vän',
      confirm: 'Ta bort',
      cancel: 'Avbryt',
      message: (name: string) =>
        `Är du säker på att du vill ta bort "${name}" från din vänlista?`,
    },
  } as const;