import { storage, Phrase } from './storage';
import phrasesData from '../data/phrases.json';

// Тип для фразы, совместимый с PhrasesScreen.tsx
export type Phrase = {
  id: number;
  phrase: string;
  translation: {
    ru: string;
    kk: string;
    en: string;
  };
};

type SQLiteCallback = (error: Error | null) => void;
type SQLiteResultCallback = (error: Error | null, result: any) => void;

interface SQLiteRow {
  id: number;
  phrase: string;
  translation_ru: string;
  translation_kk: string;
  translation_en: string;
}

interface CountRow {
  count: number;
}

// Инициализация базы данных
export const initDatabase = async (callback: SQLiteCallback) => {
  try {
    await storage.init();
    
    // Загружаем начальные данные, если база пуста
    const phrases = await storage.getAllPhrases();
    if (phrases.length === 0) {
      for (const phrase of phrasesData) {
        await storage.addPhrase(phrase);
      }
    }
    
    callback(null);
  } catch (error) {
    console.error('Database initialization failed:', error);
    callback(error instanceof Error ? error : new Error(String(error)));
  }
};

// Получение всех фраз
export const getAllPhrases = async (callback: SQLiteResultCallback) => {
  try {
    const phrases = await storage.getAllPhrases();
    callback(null, phrases);
  } catch (error) {
    console.error('Error getting phrases:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Получение количества фраз
export const getPhraseCount = async (callback: SQLiteResultCallback) => {
  try {
    const phrases = await storage.getAllPhrases();
    callback(null, phrases.length);
  } catch (error) {
    console.error('Error getting phrase count:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Добавление новой фразы
export const addPhrase = async (phrase: Omit<Phrase, 'id'>, callback: SQLiteResultCallback) => {
  try {
    await storage.addPhrase(phrase);
    callback(null, { success: true });
  } catch (error) {
    console.error('Error adding phrase:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Обновление фразы
export const updatePhrase = async (phrase: Phrase, callback: SQLiteResultCallback) => {
  try {
    const sql = `UPDATE phrases SET phrase = '${escapeString(phrase.phrase)}', translation_ru = '${escapeString(phrase.translation.ru)}', translation_kk = '${escapeString(phrase.translation.kk)}', translation_en = '${escapeString(phrase.translation.en)}' WHERE id = ${phrase.id}`;
    await db.execAsync(sql);
    callback(null, { success: true });
  } catch (error) {
    console.error('Error updating phrase:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Удаление фразы
export const deletePhrase = async (id: number, callback: SQLiteResultCallback) => {
  try {
    await db.execAsync(`DELETE FROM phrases WHERE id = ${id}`);
    callback(null, { success: true });
  } catch (error) {
    console.error('Error deleting phrase:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Поиск фраз
export const searchPhrases = async (query: string, callback: SQLiteResultCallback) => {
  try {
    const phrases = await storage.searchPhrases(query);
    callback(null, phrases);
  } catch (error) {
    console.error('Error searching phrases:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};