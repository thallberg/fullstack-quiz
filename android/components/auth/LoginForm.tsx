import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../contexts/AuthContext';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { FieldGroup, Field, FieldLabel, FieldError } from '../ui/Field';
import { colors } from '../../theme/colors';

export function LoginForm() {
  const navigation = useNavigation<any>();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    if (!email.trim()) {
      setError('E-post är obligatorisk');
      return;
    }
    if (!password) {
      setError('Lösenord är obligatoriskt');
      return;
    }
    setIsSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigation.replace('Home');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Inloggning misslyckades';
      if (msg.includes('Invalid') || msg.includes('401')) {
        setError('Fel e-post eller lösenord. Kontrollera dina uppgifter.');
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
        <Text style={styles.headerTitle}>Logga in</Text>
      </CardHeader>
      <CardBody style={styles.body}>
        <FieldGroup style={styles.fieldGroup}>
          <Field>
            <FieldLabel>E-post *</FieldLabel>
            <Input
              value={email}
              onChangeText={setEmail}
              placeholder="din@epost.se"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </Field>
          <Field>
            <FieldLabel>Lösenord *</FieldLabel>
            <Input
              value={password}
              onChangeText={setPassword}
              placeholder="Ditt lösenord"
              secureTextEntry
              autoComplete="password"
            />
          </Field>
        </FieldGroup>
        {error ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
        <Button onPress={handleSubmit} isLoading={isSubmitting} style={styles.submitBtn}>
          Logga in
        </Button>
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.linkText}>Har du inget konto? Registrera här</Text>
        </TouchableOpacity>
      </CardBody>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  header: { backgroundColor: colors.blue },
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
