import { Platform } from 'react-native';
import SQLite from './sqlite';

// Типы данных
export interface Translation {
  ru: string;
  kk: string;
  en: string;
}

export interface Phrase {
  id: number;
  phrase: string;
  translation: Translation;
}

export interface Proverb {
  id: number;
  proverb: string;
  translation: Translation;
}

// Адаптер для хранения данных
class StorageAdapter {
  private db: any;
  private isWeb: boolean;

  constructor() {
    this.isWeb = Platform.OS === 'web';
    if (!this.isWeb && SQLite) {
      this.db = SQLite.openDatabaseSync('korkem.db');
    }
  }

  // Инициализация базы данных
  async init() {
    if (this.isWeb) {
      // Для веб используем localStorage
      if (!localStorage.getItem('phrases')) {
        localStorage.setItem('phrases', JSON.stringify([]));
      }
      if (!localStorage.getItem('proverbs')) {
        localStorage.setItem('proverbs', JSON.stringify([]));
      }
    } else if (this.db) {
      // Для мобильных устройств используем SQLite
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS phrases (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          phrase TEXT NOT NULL,
          translation_ru TEXT NOT NULL,
          translation_kk TEXT NOT NULL,
          translation_en TEXT NOT NULL
        );
      `);

      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS proverbs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          proverb TEXT NOT NULL,
          translation_ru TEXT NOT NULL,
          translation_kk TEXT NOT NULL,
          translation_en TEXT NOT NULL
        );
      `);
    }
  }

  // Методы для работы с фразами
  async getAllPhrases(): Promise<Phrase[]> {
    if (this.isWeb) {
      return JSON.parse(localStorage.getItem('phrases') || '[]');
    } else if (this.db) {
      const rows = await this.db.getAllAsync('SELECT * FROM phrases');
      return rows.map((row: any) => ({
        id: row.id,
        phrase: row.phrase,
        translation: {
          ru: row.translation_ru,
          kk: row.translation_kk,
          en: row.translation_en,
        },
      }));
    }
    return [];
  }

  async addPhrase(phrase: Omit<Phrase, 'id'>): Promise<void> {
    if (this.isWeb) {
      const phrases = JSON.parse(localStorage.getItem('phrases') || '[]');
      const newId = phrases.length > 0 ? Math.max(...phrases.map((p: Phrase) => p.id)) + 1 : 1;
      phrases.push({ ...phrase, id: newId });
      localStorage.setItem('phrases', JSON.stringify(phrases));
    } else if (this.db) {
      await this.db.execAsync(
        'INSERT INTO phrases (phrase, translation_ru, translation_kk, translation_en) VALUES (?, ?, ?, ?)',
        [phrase.phrase, phrase.translation.ru, phrase.translation.kk, phrase.translation.en]
      );
    }
  }

  // Методы для работы с пословицами
  async getAllProverbs(): Promise<Proverb[]> {
    if (this.isWeb) {
      return JSON.parse(localStorage.getItem('proverbs') || '[]');
    } else if (this.db) {
      const rows = await this.db.getAllAsync('SELECT * FROM proverbs');
      return rows.map((row: any) => ({
        id: row.id,
        proverb: row.proverb,
        translation: {
          ru: row.translation_ru,
          kk: row.translation_kk,
          en: row.translation_en,
        },
      }));
    }
    return [];
  }

  async addProverb(proverb: Omit<Proverb, 'id'>): Promise<void> {
    if (this.isWeb) {
      const proverbs = JSON.parse(localStorage.getItem('proverbs') || '[]');
      const newId = proverbs.length > 0 ? Math.max(...proverbs.map((p: Proverb) => p.id)) + 1 : 1;
      proverbs.push({ ...proverb, id: newId });
      localStorage.setItem('proverbs', JSON.stringify(proverbs));
    } else if (this.db) {
      await this.db.execAsync(
        'INSERT INTO proverbs (proverb, translation_ru, translation_kk, translation_en) VALUES (?, ?, ?, ?)',
        [proverb.proverb, proverb.translation.ru, proverb.translation.kk, proverb.translation.en]
      );
    }
  }

  // Поиск
  async searchPhrases(query: string): Promise<Phrase[]> {
    const phrases = await this.getAllPhrases();
    const searchQuery = query.toLowerCase();
    return phrases.filter(phrase => 
      phrase.phrase.toLowerCase().includes(searchQuery) ||
      phrase.translation.ru.toLowerCase().includes(searchQuery) ||
      phrase.translation.kk.toLowerCase().includes(searchQuery) ||
      phrase.translation.en.toLowerCase().includes(searchQuery)
    );
  }

  async searchProverbs(query: string): Promise<Proverb[]> {
    const proverbs = await this.getAllProverbs();
    const searchQuery = query.toLowerCase();
    return proverbs.filter(proverb => 
      proverb.proverb.toLowerCase().includes(searchQuery) ||
      proverb.translation.ru.toLowerCase().includes(searchQuery) ||
      proverb.translation.kk.toLowerCase().includes(searchQuery) ||
      proverb.translation.en.toLowerCase().includes(searchQuery)
    );
  }
}

export const storage = new StorageAdapter(); 