import { useCallback } from 'react';

export const useMedalIcon = () => {
  return useCallback((position: number) => {
    if (position === 1) return '🥇';
    if (position === 2) return '🥈';
    if (position === 3) return '🥉';
    return `${position}.`;
  }, []);
};
