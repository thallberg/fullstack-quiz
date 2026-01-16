import { useState, useEffect } from 'react';
import { quizDataSource } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';

export function useFriendshipNotifications() {
  const { isAuthenticated } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      setPendingCount(0);
      setIsLoading(false);
      return;
    }

    const loadPendingCount = async () => {
      try {
        const invites = await quizDataSource.getPendingInvites();
        setPendingCount(invites.length);
      } catch (err) {
        // Silent fail - don't show errors for notification checks
        setPendingCount(0);
      } finally {
        setIsLoading(false);
      }
    };

    loadPendingCount();

    // Refresh every 30 seconds to check for new invites
    const interval = setInterval(loadPendingCount, 30000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const refreshCount = async () => {
    if (!isAuthenticated) return;
    try {
      const invites = await quizDataSource.getPendingInvites();
      setPendingCount(invites.length);
    } catch (err) {
      // Silent fail
    }
  };

  return {
    pendingCount,
    hasPendingInvites: pendingCount > 0,
    isLoading,
    refreshCount,
  };
}
