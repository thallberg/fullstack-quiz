'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { quizDataSource } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Spinner } from '@/components/ui/Spinner';
import type { FriendshipResponseDto } from '@/types';
import { PendingInvitesCard } from './PendingInvitesCard';
import { InviteFriendCard } from './InviteFriendCard';
import { FriendsListCard } from './FriendsListCard';

export function FriendsSection() {
  const { user } = useAuth();
  const [inviteEmail, setInviteEmail] = useState('');
  const [pendingInvites, setPendingInvites] = useState<FriendshipResponseDto[]>([]);
  const [friends, setFriends] = useState<FriendshipResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingInvite, setIsSendingInvite] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [removeDialog, setRemoveDialog] = useState<{ isOpen: boolean; friendshipId: number | null; friendName: string }>({
    isOpen: false,
    friendshipId: null,
    friendName: '',
  });

  useEffect(() => {
    loadFriendsData();

    const interval = setInterval(() => {
      loadFriendsData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const loadFriendsData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [invites, friendsList] = await Promise.all([
        quizDataSource.getPendingInvites(),
        quizDataSource.getFriends(),
      ]);
      setPendingInvites(invites);
      setFriends(friendsList);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kunde inte ladda vänner';
      if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
        setError('Vännersystemet är inte tillgängligt. Kontrollera att backend är deployad med FriendshipController.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvite = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!inviteEmail.trim()) {
      setError('E-post är obligatorisk');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail.trim())) {
      setError('E-postadressen är inte giltig');
      return;
    }

    setIsSendingInvite(true);

    try {
      await quizDataSource.sendFriendInvite({ email: inviteEmail.trim() });
      setSuccess(`Inbjudan skickad till ${inviteEmail.trim()}`);
      setInviteEmail('');
      await loadFriendsData();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Kunde inte skicka inbjudan';
      setError(errorMessage);
    } finally {
      setIsSendingInvite(false);
    }
  };

  const handleAcceptInvite = async (id: number) => {
    try {
      await quizDataSource.acceptFriendInvite(id);
      setSuccess('Inbjudan accepterad! Ni är nu vänner.');
      await loadFriendsData();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte acceptera inbjudan');
    }
  };

  const handleDeclineInvite = async (id: number) => {
    try {
      await quizDataSource.declineFriendInvite(id);
      setSuccess('Inbjudan avböjd');
      await loadFriendsData();
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte avböja inbjudan');
    }
  };

  const openRemoveDialog = (id: number, name: string) => {
    setRemoveDialog({ isOpen: true, friendshipId: id, friendName: name });
  };

  const closeRemoveDialog = () => {
    setRemoveDialog({ isOpen: false, friendshipId: null, friendName: '' });
  };

  const handleRemoveFriend = async () => {
    if (!removeDialog.friendshipId) return;

    try {
      await quizDataSource.removeFriend(removeDialog.friendshipId);
      setSuccess('Vänskap borttagen');
      closeRemoveDialog();
      await loadFriendsData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ta bort vän');
    }
  };

  const getFriendDisplayName = (friendship: FriendshipResponseDto): string => {
    if (friendship.requesterId === user?.id) {
      return friendship.addresseeUsername;
    }
    return friendship.requesterUsername;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 gap-4">
        <Spinner size="lg" className="border-purple" />
        <p className="text-gray-500">Laddar vänner...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PendingInvitesCard
        pendingInvites={pendingInvites}
        onAccept={handleAcceptInvite}
        onDecline={handleDeclineInvite}
      />

      <InviteFriendCard
        inviteEmail={inviteEmail}
        onInviteEmailChange={setInviteEmail}
        onSubmit={handleSendInvite}
        isSendingInvite={isSendingInvite}
        error={error}
        success={success}
      />

      <FriendsListCard
        friends={friends}
        getFriendDisplayName={getFriendDisplayName}
        onRemove={openRemoveDialog}
      />

      <ConfirmDialog
        isOpen={removeDialog.isOpen}
        title="Ta bort vän"
        message={`Är du säker på att du vill ta bort "${removeDialog.friendName}" från din vänlista?`}
        confirmText="Ta bort"
        cancelText="Avbryt"
        variant="danger"
        onConfirm={handleRemoveFriend}
        onCancel={closeRemoveDialog}
      />
    </div>
  );
}
