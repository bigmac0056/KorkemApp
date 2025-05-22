// hooks/useTranslation.ts
import { useLanguage } from '@/contexts/LanguageContext';
import { translations } from '@/utils/i18n';

export function useTranslation() {
  const { language } = useLanguage();
  const t = translations[language];

  return { t };
}