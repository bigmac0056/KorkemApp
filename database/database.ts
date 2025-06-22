import { storage } from './storage';
import phrasesData from '../data/phrases.json';
import proverbsData from '../data/proverbs.json';
import { Proverb } from './types';

// Экспортируем тип Proverb для использования в других файлах
export type { Proverb } from './types';

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

// Функция для очистки базы данных
export async function clearDatabase() {
  try {
    await storage.clearDatabase();
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

// Функция для инициализации базы данных
export async function initDatabase() {
  try {
    console.log('[DB] Initializing database...');
    // Инициализация базы данных (создание таблиц)
    await storage.initDatabase();
    console.log('[DB] Database and tables initialized.');

    // --- Загрузка Фраз ---
    const phrases = await storage.getPhrases();
    if (!phrases || phrases.length === 0) {
      console.log('[DB] Loading initial phrases data...');
      if (Array.isArray(phrasesData)) {
        const transformedPhrases = phrasesData.map((item: any) => ({
          id: item.id,
          phrase: item.phrase,
          translation: {
            ru: item.translation.ru,
            kk: item.translation.kk,
            en: item.translation.en
          }
        }));
        await storage.loadPhrases(transformedPhrases);
        console.log(`[DB] ${transformedPhrases.length} phrases loaded successfully.`);
      } else {
        console.log('[DB] No phrases data found in JSON file');
      }
    }

    // --- Загрузка Пословиц ---
    const proverbs = await storage.getAllProverbs();
    if (!proverbs || proverbs.length === 0) {
      console.log('[DB] Loading initial proverbs data...');
      if (Array.isArray(proverbsData)) {
        await storage.loadProverbs(proverbsData as Proverb[]);
        console.log(`[DB] ${proverbsData.length} proverbs loaded successfully.`);
      } else {
        console.log('[DB] No proverbs data found in JSON file');
      }
    }
    console.log('[DB] Database initialization complete.');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}

// Функция для получения всех фраз
export async function getPhrases(): Promise<Phrase[]> {
  try {
    return await storage.getPhrases();
  } catch (error) {
    console.error('Error getting phrases:', error);
    throw error;
  }
}

// Получение количества фраз
export const getPhraseCount = async (callback: SQLiteResultCallback) => {
  try {
    const phrases = await storage.getPhrases();
    callback(null, phrases.length);
  } catch (error) {
    console.error('Error getting phrase count:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Добавление новой фразы
export const addPhrase = async (phrase: Omit<Phrase, 'id'>, callback: SQLiteResultCallback) => {
  try {
    await storage.loadPhrases([{ ...phrase, id: Date.now() }]);
    callback(null, { success: true });
  } catch (error) {
    console.error('Error adding phrase:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Обновление фразы
export const updatePhrase = async (phrase: Phrase, callback: SQLiteResultCallback) => {
  try {
    const phrases = await storage.getPhrases();
    const index = phrases.findIndex(p => p.id === phrase.id);
    if (index !== -1) {
      phrases[index] = phrase;
      await storage.loadPhrases(phrases);
      callback(null, { success: true });
    } else {
      throw new Error('Phrase not found');
    }
  } catch (error) {
    console.error('Error updating phrase:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Удаление фразы
export const deletePhrase = async (id: number, callback: SQLiteResultCallback) => {
  try {
    const phrases = await storage.getPhrases();
    const filteredPhrases = phrases.filter(p => p.id !== id);
    await storage.loadPhrases(filteredPhrases);
    callback(null, { success: true });
  } catch (error) {
    console.error('Error deleting phrase:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Функция для поиска фраз
export async function searchPhrases(query: string): Promise<Phrase[]> {
  try {
    return await storage.searchPhrases(query);
  } catch (error) {
    console.error('Error searching phrases:', error);
    throw error;
  }
}

// === ФУНКЦИИ ДЛЯ ПОСЛОВИЦ ===

// Функция для получения всех пословиц
export async function getAllProverbs(): Promise<Proverb[]> {
  try {
    return await storage.getAllProverbs();
  } catch (error) {
    console.error('Error getting proverbs:', error);
    throw error;
  }
}

// Функция для поиска пословиц
export async function searchProverbs(query: string): Promise<Proverb[]> {
  try {
    return await storage.searchProverbs(query);
  } catch (error) {
    console.error('Error searching proverbs:', error);
    throw error;
  }
}

// Функция для добавления пословицы
export async function addProverb(proverb: Omit<Proverb, 'id'>): Promise<void> {
  try {
    await storage.addProverb({ ...proverb, id: Date.now() });
  } catch (error) {
    console.error('Error adding proverb:', error);
    throw error;
  }
}

// Функция для обновления пословицы
export async function updateProverb(proverb: Proverb): Promise<void> {
  try {
    await storage.updateProverb(proverb);
  } catch (error) {
    console.error('Error updating proverb:', error);
    throw error;
  }
}

// Функция для удаления пословицы
export async function deleteProverb(id: number): Promise<void> {
  try {
    await storage.deleteProverb(id);
  } catch (error) {
    console.error('Error deleting proverb:', error);
    throw error;
  }
}

// Функция для получения количества пословиц
export async function getProverbCount(): Promise<number> {
  try {
    const proverbs = await storage.getAllProverbs();
    return proverbs.length;
  } catch (error) {
    console.error('Error getting proverb count:', error);
    throw error;
  }
}

// Функция для инициализации только пословиц (для обратной совместимости)
export async function initProverbsDatabase(): Promise<void> {
  try {
    await storage.initDatabase();
    
    const proverbs = await storage.getAllProverbs();
    if (proverbs.length === 0) {
      console.log('Loading initial proverbs data...');
      if (Array.isArray(proverbsData)) {
        for (const proverb of proverbsData) {
          await storage.addProverb(proverb);
        }
      }
      console.log('Initial proverbs data loaded successfully');
    } else {
      console.log(`Database already contains ${proverbs.length} proverbs`);
    }
  } catch (error) {
    console.error('Error initializing proverbs database:', error);
    throw error;
  }
}