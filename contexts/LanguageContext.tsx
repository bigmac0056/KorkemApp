import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Language = 'ru' | 'kz' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const defaultContext: LanguageContextType = {
  language: 'ru',
  setLanguage: () => {},
};

const LanguageContext = createContext<LanguageContextType>(defaultContext);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('ru');

  useEffect(() => {
    let isMounted = true;
    
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('language');
        if (isMounted && savedLanguage && ['ru', 'kz', 'en'].includes(savedLanguage)) {
          setLanguageState(savedLanguage as Language);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      }
    };

    loadLanguage();

    return () => {
      isMounted = false;
    };
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    try {
      await AsyncStorage.setItem('language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  const contextValue = useMemo(() => ({
    language,
    setLanguage
  }), [language, setLanguage]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguageContext() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    console.warn('useLanguageContext must be used within a LanguageProvider');
    return defaultContext;
  }
  return context;
}