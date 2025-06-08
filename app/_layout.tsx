import { Slot } from 'expo-router';
import { LanguageProvider } from '../contexts/LanguageContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const RootLayout = () => {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <Slot />
      </LanguageProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;