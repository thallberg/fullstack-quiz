'use client';

import { useState, useEffect } from 'react';
import { quizDataSource } from '@/lib/data';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Spinner } from '../ui/Spinner';
import type { FriendshipResponseDto } from '@/types';

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
    
    // Refresh every 30 seconds to check for new invites
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
      // Om det är ett 404-fel, kan det bero på att backend inte är deployad eller att routen saknas
      if (errorMessage.includes('404') || errorMessage.includes('Not Found')) {
        setError('Vännersystemet är inte tillgängligt. Kontrollera att backend är deployad med FriendshipController.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvite = async (e: React.FormEvent) => {
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
      // Refresh page after a short delay to update notifications
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
      // Refresh page after a short delay to update notifications
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
      {/* Pending Invites - Prominent Display FIRST */}
      {pendingInvites.length > 0 && (
        <Card className="border-[var(--color-yellow)]/50 shadow-2xl ring-4 ring-[var(--color-yellow)]/30">
          <CardHeader className="bg-gradient-to-r from-[var(--color-yellow)] to-[var(--color-orange)] text-white border-[var(--color-yellow)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
            <div className="flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-[var(--color-red)] text-white rounded-full text-lg font-bold animate-pulse">
                !
              </span>
              <h3 className="text-xl font-bold">Ny väninbjudan ({pendingInvites.length})</h3>
            </div>
          </CardHeader>
          <CardBody className="p-4 sm:p-6">
            <ul className="space-y-3">
              {pendingInvites.map((invite) => (
                <li key={invite.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-[var(--color-yellow)]/50 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">{invite.requesterUsername}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAcceptInvite(invite.id)}
                      className="text-sm"
                    >
                      Acceptera
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeclineInvite(invite.id)}
                      className="text-sm"
                    >
                      Avböj
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      )}

      {/* Send Invite Form */}
      <Card className="border-[var(--color-purple)]/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-pink)] text-white border-[var(--color-purple)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
          <h3 className="text-xl font-bold">Bjud in vän</h3>
        </CardHeader>
        <CardBody className="p-4 sm:p-6">
          {success && (
            <div className="mb-4 p-4 bg-gray-50 border border-[var(--color-green)]/50 rounded-lg">
              <p className="text-sm font-medium text-[var(--color-green)]">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-gray-50 border border-[var(--color-red)]/50 rounded-lg">
              <p className="text-sm font-medium text-[var(--color-red)]">{error}</p>
            </div>
          )}

          <form onSubmit={handleSendInvite} className="space-y-4">
            <div>
              <Label htmlFor="invite-email" required className="text-base">
                E-postadress
              </Label>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Input
                  id="invite-email"
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="vän@epost.se"
                  required
                  className="flex-1 py-2.5 text-base"
                />
                <Button type="submit" isLoading={isSendingInvite} className="w-full sm:w-auto py-2.5">
                  Skicka inbjudan
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Friends List */}
      <Card className="border-[var(--color-green)]/50 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[var(--color-green)] to-[var(--color-emerald)] text-white border-[var(--color-green)] !py-2 !px-3 sm:!py-2.5 sm:!px-4">
          <h3 className="text-xl font-bold">Mina vänner ({friends.length})</h3>
        </CardHeader>
        <CardBody className="p-4 sm:p-6">
          {friends.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Du har inga vänner ännu. Bjud in någon för att komma igång!</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {friends.map((friendship) => (
                <li key={friendship.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border border-[var(--color-green)]/50 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <p className="font-medium text-gray-700">{getFriendDisplayName(friendship)}</p>
                    {friendship.acceptedAt && (
                      <Badge variant="default" className="mt-1">
                        Vänner sedan {new Date(friendship.acceptedAt).toLocaleDateString('sv-SE')}
                      </Badge>
                    )}
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openRemoveDialog(friendship.id, getFriendDisplayName(friendship))}
                    className="text-sm w-full sm:w-auto"
                  >
                    Ta bort vän
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>

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
