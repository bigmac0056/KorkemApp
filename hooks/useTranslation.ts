// hooks/useTranslation.ts
import { useLanguageContext } from '../contexts/LanguageContext';
import translations from '../data/locales.json';

export function useTranslation() {
  const { language } = useLanguageContext();
  const currentLanguage = language || 'ru';
  const t = translations[currentLanguage as keyof typeof translations];
  
  if (!t) {
    console.warn(`Translations not found for language: ${currentLanguage}, falling back to Russian`);
    return translations.ru;
  }
  
  return t;
}