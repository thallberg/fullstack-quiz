import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card, CardHeader, CardBody } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { colors } from '../../theme/colors';

export function WelcomeSection() {
  const navigation = useNavigation<any>();

  return (
    <Card style={styles.card}>
      <CardHeader style={[styles.header, { backgroundColor: colors.purple }]}>
        <Text style={styles.title}>Välkommen till Quiz App! 🎯</Text>
        <Text style={styles.subtitle}>Skapa, spela och dela quiz med andra användare</Text>
      </CardHeader>
      <CardBody style={styles.body}>
        <Text style={styles.sectionTitle}>Vad är Quiz App?</Text>
        <Text style={styles.para}>
          Quiz App är en plattform där du kan skapa egna quiz med ja/nej-frågor och utmana dig
          själv eller andra användare.
        </Text>
        <View style={styles.badges}>
          <Badge variant="info">Skapa quiz</Badge>
          <Badge variant="success">Spela quiz</Badge>
          <Badge variant="warning">Dela med andra</Badge>
        </View>
        <Text style={styles.sectionTitle}>Kom igång</Text>
        <View style={styles.step}>
          <View style={styles.stepNum}>
            <Text style={styles.stepNumText}>1</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Registrera dig</Text>
            <Text style={styles.para}>Skapa ett konto med användarnamn, e-post och lösenord.</Text>
            <Button variant="primary" size="sm" onPress={() => navigation.navigate('Register')}>
              Gå till registrering →
            </Button>
          </View>
        </View>
        <View style={styles.step}>
          <View style={[styles.stepNum, { backgroundColor: colors.purple }]}>
            <Text style={styles.stepNumText}>2</Text>
          </View>
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Logga in</Text>
            <Text style={styles.para}>Efter registrering kan du logga in med e-post och lösenord.</Text>
            <Button variant="secondary" size="sm" onPress={() => navigation.navigate('Login')}>
              Gå till inloggning →
            </Button>
          </View>
        </View>
        <View style={styles.actions}>
          <Button variant="primary" size="lg" onPress={() => navigation.navigate('Register')} style={styles.btn}>
            Registrera dig nu
          </Button>
          <Button variant="outline" size="lg" onPress={() => navigation.navigate('Login')} style={styles.btn}>
            Jag har redan ett konto
          </Button>
        </View>
      </CardBody>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { borderColor: colors.purple + '80', marginHorizontal: 16 },
  header: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', color: colors.white, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.white, opacity: 0.9, textAlign: 'center' },
  body: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: colors.gray900, marginBottom: 8 },
  para: { fontSize: 14, color: colors.gray700, marginBottom: 12 },
  badges: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  step: { flexDirection: 'row', marginBottom: 20, gap: 12 },
  stepNum: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: { fontSize: 18, fontWeight: '700', color: colors.white },
  stepContent: { flex: 1 },
  stepTitle: { fontSize: 16, fontWeight: '600', color: colors.gray900, marginBottom: 4 },
  actions: { marginTop: 24, gap: 12 },
  btn: { width: '100%' },
});
