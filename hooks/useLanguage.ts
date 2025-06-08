import { create } from 'zustand';

export type Language = 'ru' | 'kz' | 'en';

interface LanguageState {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguage = create<LanguageState>((set) => ({
  language: 'ru',
  setLanguage: (language) => set({ language }),
})); 