import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FieldGroup, Field, FieldLabel } from '../ui/Field';
import { colors } from '../../theme/colors';

export function RegisterForm() {
  const navigation = useNavigation<any>();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!username.trim() || username.trim().length < 3) {
      setError('Användarnamn måste vara minst 3 tecken');
      return;
    }
    if (!email.trim()) {
      setError('E-post är obligatorisk');
      return;
    }
    if (!password || password.length < 6) {
      setError('Lösenordet måste vara minst 6 tecken');
      return;
    }
    if (password !== confirmPassword) {
      setError('Lösenorden matchar inte');
      return;
    }
    setIsSubmitting(true);
    try {
      await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });
      navigation.replace('Home');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Registrering misslyckades';
      if (msg.includes('already exists') || msg.includes('Email')) {
        setError('E-postadressen är redan registrerad. Logga in eller använd annan e-post.');
      } else {
        setError(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card style={styles.card}>
      <CardHeader style={styles.header}>
        <Text style={styles.headerTitle}>Registrera</Text>
      </CardHeader>
      <CardBody style={styles.body}>
        <FieldGroup style={styles.fieldGroup}>
          <Field>
            <FieldLabel required>Användarnamn</FieldLabel>
            <Input
              value={username}
              onChangeText={setUsername}
              placeholder="Ditt användarnamn"
              autoCapitalize="none"
            />
          </Field>
          <Field>
            <FieldLabel required>E-post</FieldLabel>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="din@epost.se"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </Field>
          <Field>
            <FieldLabel required>Lösenord</FieldLabel>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Minst 6 tecken"
              secureTextEntry
            />
          </Field>
          <Field>
            <FieldLabel required>Bekräfta lösenord</FieldLabel>
            <Input
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Bekräfta lösenordet"
              secureTextEntry
            />
          </Field>
        </FieldGroup>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        <Button onPress={handleSubmit} isLoading={isSubmitting} style={styles.submitBtn}>
          Registrera
        </Button>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.linkText}>Har du redan ett konto? Logga in här</Text>
        </TouchableOpacity>
      </CardBody>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  header: { backgroundColor: colors.pink },
  headerTitle: { fontSize: 24, fontWeight: '700', color: colors.white },
  body: { padding: 24 },
  fieldGroup: { gap: 20, marginBottom: 24 },
  errorBox: {
    padding: 16,
    backgroundColor: colors.gray50,
    borderWidth: 1,
    borderColor: colors.red + '80',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: { fontSize: 14, color: colors.red },
  submitBtn: { marginBottom: 16 },
  link: { alignSelf: 'center' },
  linkText: { fontSize: 14, color: colors.blue, fontWeight: '500' },
});
