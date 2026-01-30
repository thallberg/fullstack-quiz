import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { colors } from '../../theme/colors';

export function ProfileSection() {
  const { user, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setUsername(user.username ?? '');
      setEmail(user.email ?? '');
    }
  }, [user]);

  const handleSave = async () => {
    setError('');
    setSuccess('');
    if (!username.trim() || !email.trim()) {
      setError('Användarnamn och e-post krävs');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Ogiltig e-post');
      return;
    }
    setIsSubmitting(true);
    try {
      await updateProfile({ username: username.trim(), email: email.trim() });
      setSuccess('Profil uppdaterad!');
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunde inte uppdatera');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      {success ? <Text style={styles.success}>{success}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.field}>
        <Label>Användarnamn</Label>
        <Input
          value={username}
          onChangeText={setUsername}
          placeholder="Användarnamn"
          editable={isEditing}
        />
      </View>
      <View style={styles.field}>
        <Label>E-post</Label>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="E-post"
          keyboardType="email-address"
          editable={isEditing}
        />
      </View>
      {isEditing ? (
        <View style={styles.actions}>
          <Button onPress={handleSave} isLoading={isSubmitting}>Spara</Button>
          <Button variant="outline" onPress={() => setIsEditing(false)}>Avbryt</Button>
        </View>
      ) : (
        <Button variant="secondary" onPress={() => setIsEditing(true)}>Redigera profil</Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 8 },
  field: { marginBottom: 16 },
  success: { color: colors.green, marginBottom: 12 },
  error: { color: colors.red, marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 12, marginTop: 8 },
});
