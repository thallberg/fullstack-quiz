import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { quizDataSource } from '../../lib/data';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Spinner } from '../ui/Spinner';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import type { FriendshipResponseDto } from '../../types';
import { colors } from '../../theme/colors';

export function FriendsSection() {
  const { user } = useAuth();
  const currentUserId = user?.id;
  const [inviteEmail, setInviteEmail] = useState('');
  const [pendingInvites, setPendingInvites] = useState<FriendshipResponseDto[]>([]);
  const [friends, setFriends] = useState<FriendshipResponseDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [removeDialog, setRemoveDialog] = useState<{
    isOpen: boolean;
    id: number | null;
    name: string;
  }>({ isOpen: false, id: null, name: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError('');
      const [invites, friendsList] = await Promise.all([
        quizDataSource.getPendingInvites(),
        quizDataSource.getFriends(),
      ]);
      setPendingInvites(invites ?? []);
      setFriends(friendsList ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ladda');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendInvite = async () => {
    setError('');
    setSuccess('');
    if (!inviteEmail.trim()) {
      setError('E-post krävs');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail.trim())) {
      setError('Ogiltig e-post');
      return;
    }
    setIsSending(true);
    try {
      await quizDataSource.sendFriendInvite({ email: inviteEmail.trim() });
      setSuccess(`Inbjudan skickad till ${inviteEmail.trim()}`);
      setInviteEmail('');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte skicka');
    } finally {
      setIsSending(false);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      await quizDataSource.acceptFriendInvite(id);
      setSuccess('Inbjudan accepterad!');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte acceptera');
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await quizDataSource.declineFriendInvite(id);
      setSuccess('Inbjudan avböjd');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte avböja');
    }
  };

  const openRemove = (id: number, name: string) => {
    setRemoveDialog({ isOpen: true, id, name });
  };
  const closeRemove = () => setRemoveDialog({ isOpen: false, id: null, name: '' });

  const handleRemoveConfirm = async () => {
    if (!removeDialog.id) return;
    try {
      await quizDataSource.removeFriend(removeDialog.id);
      setSuccess('Vän borttagen');
      await loadData();
      closeRemove();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte ta bort');
      closeRemove();
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Spinner size="lg" />
        <Text style={styles.loadingText}>Laddar...</Text>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      {success ? <Text style={styles.success}>{success}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.field}>
        <Label>Bjud in med e-post</Label>
        <Input
          value={inviteEmail}
          onChangeText={setInviteEmail}
          placeholder="e-post@exempel.se"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button onPress={handleSendInvite} isLoading={isSending} style={styles.mt}>
          Skicka inbjudan
        </Button>
      </View>
      {pendingInvites.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Väntande inbjudningar</Text>
          {pendingInvites.map((inv) => (
            <View key={inv.id} style={styles.row}>
              <Text style={styles.rowText}>{inv.requesterUsername} ({inv.requesterEmail})</Text>
              <View style={styles.rowActions}>
                <Button variant="primary" size="sm" onPress={() => handleAccept(inv.id)}>
                  Acceptera
                </Button>
                <Button variant="outline" size="sm" onPress={() => handleDecline(inv.id)}>
                  Avböj
                </Button>
              </View>
            </View>
          ))}
        </View>
      ) : null}
      {friends.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mina vänner</Text>
          {friends.map((f) => {
            const name = f.requesterId === currentUserId ? f.addresseeUsername : f.requesterUsername;
            return (
              <View key={f.id} style={styles.row}>
                <Text style={styles.rowText}>{name}</Text>
                <Button variant="danger" size="sm" onPress={() => openRemove(f.id, name)}>
                  Ta bort
                </Button>
              </View>
            );
          })}
        </View>
      ) : null}
      <ConfirmDialog
        isOpen={removeDialog.isOpen}
        title="Ta bort vän"
        message={`Ta bort ${removeDialog.name} som vän?`}
        confirmText="Ta bort"
        cancelText="Avbryt"
        variant="danger"
        onConfirm={handleRemoveConfirm}
        onCancel={closeRemove}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 8 },
  centered: { alignItems: 'center', padding: 16 },
  loadingText: { marginTop: 8, color: colors.gray500 },
  success: { color: colors.green, marginBottom: 12 },
  error: { color: colors.red, marginBottom: 12 },
  field: { marginBottom: 20 },
  mt: { marginTop: 8 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: colors.gray900, marginBottom: 8 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: colors.gray50,
    borderRadius: 8,
    marginBottom: 8,
  },
  rowText: { flex: 1, fontSize: 14, color: colors.gray700 },
  rowActions: { flexDirection: 'row', gap: 8 },
});
