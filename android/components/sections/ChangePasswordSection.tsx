import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { quizDataSource } from '../../lib/data';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { colors } from '../../theme/colors';

export function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!currentPassword.trim()) {
      setError('Nuvarande lösenord krävs');
      return;
    }
    if (!newPassword.trim()) {
      setError('Nytt lösenord krävs');
      return;
    }
    if (newPassword.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }
    setIsSubmitting(true);
    try {
      await quizDataSource.changePassword({
        currentPassword,
        newPassword,
      });
      setSuccess('Lösenord ändrat!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Kunde inte ändra lösenord';
      if (msg.includes('current password') || msg.includes('Invalid')) {
        setError('Nuvarande lösenord är felaktigt.');
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      {success ? <Text style={styles.success}>{success}</Text> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <View style={styles.field}>
        <Label required>Nuvarande lösenord</Label>
        <Input
          value={currentPassword}
          onChangeText={setCurrentPassword}
          placeholder="Nuvarande lösenord"
          secureTextEntry
        />
      </View>
      <View style={styles.field}>
        <Label required>Nytt lösenord</Label>
        <Input
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Minst 6 tecken"
          secureTextEntry
        />
      </View>
      <View style={styles.field}>
        <Label required>Bekräfta nytt lösenord</Label>
        <Input
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Bekräfta lösenordet"
          secureTextEntry
        />
      </View>
      <Button onPress={handleSubmit} isLoading={isSubmitting}>
        Ändra lösenord
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { padding: 8 },
  field: { marginBottom: 16 },
  success: { color: colors.green, marginBottom: 12 },
  error: { color: colors.red, marginBottom: 12 },
});
