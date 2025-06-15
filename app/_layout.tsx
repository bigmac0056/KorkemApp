import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LanguageProvider } from '../contexts/LanguageContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, ActivityIndicator } from 'react-native';
import { API_URL } from '../constants/config';

function RootLayoutInner() {
  const [isReady, setIsReady] = useState(false);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    checkFirstLaunch();
  }, []);

  const checkFirstLaunch = async () => {
    try {
      const hasLaunched = await AsyncStorage.getItem('hasLaunched');
      if (hasLaunched === null) {
        await AsyncStorage.setItem('hasLaunched', 'true');
        setIsFirstLaunch(true);
      } else {
        setIsFirstLaunch(false);
      }
      setIsReady(true);
    } catch (error) {
      console.error('Error checking first launch:', error);
      setIsFirstLaunch(false);
      setIsReady(true);
    }
  };

  useEffect(() => {
    if (!isReady) return;
    
    if (isFirstLaunch) {
      router.replace('/welcome');
      return;
    }

    const inAuthGroup = segments[0] === 'auth';
    const isWelcomeScreen = segments[0] === 'welcome';
    
    if (!isAuthenticated && !inAuthGroup && !isWelcomeScreen) {
      router.push('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      router.push('/(tabs)/home');
    }
  }, [isAuthenticated, segments, isReady, isFirstLaunch]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <Slot />;
}

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