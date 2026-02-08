import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppDrawerContent } from '../components/AppDrawer';
import { DrawerMenuButton } from '../components/DrawerMenuButton';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { CreateScreen } from '../screens/CreateScreen';
import { LeaderboardScreen } from '../screens/LeaderboardScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ProfileDetailsScreen } from '../screens/ProfileDetailsScreen';
import { MyQuizzesScreen } from '../screens/MyQuizzesScreen';
import { FriendsScreen } from '../screens/FriendsScreen';
import { MyLeaderboardScreen } from '../screens/MyLeaderboardScreen';
import { AccountScreen } from '../screens/AccountScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { QuizListScreen } from '../screens/QuizListScreen';
import { QuizPlayScreen } from '../screens/QuizPlayScreen';
import { QuizEditScreen } from '../screens/QuizEditScreen';
import { QuizLeaderboardScreen } from '../screens/QuizLeaderboardScreen';
import { SavedQuestionsScreen } from '../screens/SavedQuestionsScreen';
import { useAuth } from '../contexts/AuthContext';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const headerStyle = {
  headerStyle: { backgroundColor: colors.purple },
  headerTintColor: colors.white,
  headerTitleStyle: { fontWeight: '700' as const, fontSize: 18 },
  headerLeft: () => <DrawerMenuButton />,
};

function MainStack() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={headerStyle}>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Quiz App 🎯' }}
      />
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Logga in' }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Registrera' }} />
        </>
      ) : null}
      <Stack.Screen name="QuizList" component={QuizListScreen} options={{ title: 'Alla quiz' }} />
      <Stack.Screen name="Create" component={CreateScreen} options={{ title: 'Skapa Quiz' }} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: 'Leaderboard' }} />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Min Profil' }} />
      <Stack.Screen name="ProfileDetails" component={ProfileDetailsScreen} options={{ title: 'Min profil' }} />
      <Stack.Screen name="MyQuizzes" component={MyQuizzesScreen} options={{ title: 'Mina quiz' }} />
      <Stack.Screen name="Friends" component={FriendsScreen} options={{ title: 'Mina vänner' }} />
      <Stack.Screen name="MyLeaderboard" component={MyLeaderboardScreen} options={{ title: 'Min leaderboard' }} />
      <Stack.Screen name="Account" component={AccountScreen} options={{ title: 'Konto' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Inställningar' }} />
      <Stack.Screen name="QuizPlay" component={QuizPlayScreen} options={{ title: 'Spela Quiz' }} />
      <Stack.Screen name="QuizEdit" component={QuizEditScreen} options={{ title: 'Redigera Quiz' }} />
      <Stack.Screen name="QuizLeaderboard" component={QuizLeaderboardScreen} options={{ title: 'Leaderboard' }} />
      <Stack.Screen name="SavedQuestions" component={SavedQuestionsScreen} options={{ title: 'Sparade frågor' }} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <AppDrawerContent {...props} />}
        screenOptions={{
          drawerActiveTintColor: colors.purple,
          drawerInactiveTintColor: colors.gray700,
          headerShown: false,
        }}
      >
        <Drawer.Screen name="Main" component={MainStack} options={{ title: 'Hem' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
