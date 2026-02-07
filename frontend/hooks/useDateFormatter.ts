import { useCallback } from 'react';

const DEFAULT_LOCALE = 'sv-SE';

export const useDateFormatter = (locale: string = DEFAULT_LOCALE) => {
  return useCallback(
    (dateString: string) => {
      if (!dateString) {
        return '';
      }

      const date = new Date(dateString);
      return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
    [locale]
  );
};
