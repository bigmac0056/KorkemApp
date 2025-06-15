import { storage, Proverb } from './storage';
import proverbsData from '../data/proverbs.json';

// Тип для пословицы
export interface Proverb {
  id: number;
  proverb: string;
  translation: {
    ru: string;
    kk: string;
    en: string;
  };
}

type SQLiteCallback = (error: Error | null) => void;
type SQLiteResultCallback = (error: Error | null, result: any) => void;

interface SQLiteRow {
  id: number;
  proverb: string;
  translation_ru: string;
  translation_kk: string;
  translation_en: string;
}

interface CountRow {
  count: number;
}

// Инициализация базы данных
export const initProverbsDatabase = async (callback: SQLiteCallback) => {
  try {
    await storage.init();
    
    // Загружаем начальные данные, если база пуста
    const proverbs = await storage.getAllProverbs();
    if (proverbs.length === 0) {
      for (const proverb of proverbsData) {
        await storage.addProverb(proverb);
      }
    }
    
    callback(null);
  } catch (error) {
    console.error('Database initialization failed:', error);
    callback(error instanceof Error ? error : new Error(String(error)));
  }
};

// Получение всех пословиц
export const getAllProverbs = async (callback: SQLiteResultCallback) => {
  try {
    const proverbs = await storage.getAllProverbs();
    callback(null, proverbs);
  } catch (error) {
    console.error('Error getting proverbs:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Получение количества пословиц
export const getProverbCount = async (callback: SQLiteResultCallback) => {
  try {
    const proverbs = await storage.getAllProverbs();
    callback(null, proverbs.length);
  } catch (error) {
    console.error('Error getting proverb count:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Добавление новой пословицы
export const addProverb = async (proverb: Omit<Proverb, 'id'>, callback: SQLiteResultCallback) => {
  try {
    await storage.addProverb(proverb);
    callback(null, { success: true });
  } catch (error) {
    console.error('Error adding proverb:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Обновление пословицы
export const updateProverb = async (proverb: Proverb, callback: SQLiteResultCallback) => {
  try {
    const sql = `UPDATE proverbs SET proverb = '${escapeString(proverb.proverb)}', translation_ru = '${escapeString(proverb.translation.ru)}', translation_kk = '${escapeString(proverb.translation.kk)}', translation_en = '${escapeString(proverb.translation.en)}' WHERE id = ${proverb.id}`;
    await db.execAsync(sql);
    callback(null, { success: true });
  } catch (error) {
    console.error('Error updating proverb:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Удаление пословицы
export const deleteProverb = async (id: number, callback: SQLiteResultCallback) => {
  try {
    await db.execAsync(`DELETE FROM proverbs WHERE id = ${id}`);
    callback(null, { success: true });
  } catch (error) {
    console.error('Error deleting proverb:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Поиск пословиц
export const searchProverbs = async (query: string, callback: SQLiteResultCallback) => {
  try {
    const proverbs = await storage.searchProverbs(query);
    callback(null, proverbs);
  } catch (error) {
    console.error('Error searching proverbs:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};

// Функция для экранирования строк в SQL
const escapeString = (str: string): string => {
  return str.replace(/'/g, "''");
}; 