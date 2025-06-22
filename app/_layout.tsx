import { useEffect, useLayoutEffect, useState, Suspense } from 'react';
import { Slot, useRouter, useSegments, Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator, Text, StyleSheet, Platform } from 'react-native';
import { API_URL } from '../constants/config';
import { initDatabase } from '../database/database';

function RootLayoutInner() {
  const [isReady, setIsReady] = useState(false);
  const [dbReady, setDbReady] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (Platform.OS === 'web') {
      setDbReady(true);
      setIsReady(true);
      return;
    }
    const initialize = async () => {
      try {
        await initDatabase();
        setDbReady(true);
      } catch (error: any) {
        setInitError(error.message || 'Unknown DB error');
      }
    };
    initialize();
  }, []);

  // useLayoutEffect для мобильных
  useLayoutEffect(() => {
    if (Platform.OS === 'web') return;
    if (!dbReady) return;
    const initializeApp = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunched');
        const inAuthGroup = segments[0] === 'auth';
        const isWelcomeScreen = segments[0] === 'welcome';
        if (hasLaunched === null) {
          await AsyncStorage.setItem('hasLaunched', 'true');
          router.replace('/welcome');
        } else if (!isAuthenticated && !inAuthGroup && !isWelcomeScreen) {
          router.replace('/auth/login');
        }
      } catch (error: any) {
        setInitError(error.message || 'An unknown error occurred during initialization.');
      } finally {
        setIsReady(true);
      }
    };
    initializeApp();
  }, [isAuthenticated, segments, dbReady]);

  // Условный редирект для web
  if (Platform.OS === 'web') {
    const inAuthGroup = segments[0] === 'auth';
    const isWelcomeScreen = segments[0] === 'welcome';
    if (!isAuthenticated && !inAuthGroup && !isWelcomeScreen) {
      return <Redirect href="/auth/login" />;
    }
    if (isAuthenticated && inAuthGroup) {
      // Если залогинен, но на странице логина/регистрации — редиректим на home
      return <Redirect href="/(tabs)/home" />;
    }
  }

  if (initError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Fatal Error</Text>
        <Text style={styles.errorMessage}>{initError}</Text>
      </View>
    );
  }

  if (!isReady || !dbReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Suspense fallback={
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    }>
      <Slot />
    </Suspense>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginBottom: 15,
  },
  errorMessage: {
    fontSize: 16,
    color: '#f2f2f7',
    textAlign: 'center',
    fontFamily: 'monospace',
  },
});

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <AuthProvider>
          <RootLayoutInner />
        </AuthProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}