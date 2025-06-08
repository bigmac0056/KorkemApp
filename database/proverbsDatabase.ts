import * as SQLite from 'expo-sqlite';
import proverbsData from '../data/proverbs.json';

// Тип для пословицы
export type Proverb = {
  id: number;
  proverb: string;
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
  proverb: string;
  translation_ru: string;
  translation_kk: string;
  translation_en: string;
}

interface CountRow {
  count: number;
}

// Используем openDatabaseSync, так как это единственный доступный метод
const db = SQLite.openDatabaseSync('proverbs.db');

// Функция для экранирования строк в SQL
const escapeString = (str: string): string => {
  return str.replace(/'/g, "''");
};

// Создаем таблицу и загружаем данные
const initializeDatabase = async () => {
  try {
    // Удаляем таблицу, если она существует
    await db.execAsync('DROP TABLE IF EXISTS proverbs');
    
    // Создаем таблицу
    await db.execAsync(`CREATE TABLE proverbs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      proverb TEXT NOT NULL,
      translation_ru TEXT NOT NULL,
      translation_kk TEXT NOT NULL,
      translation_en TEXT NOT NULL
    )`);

    // Загружаем все пословицы из JSON
    const batchSize = 100;
    for (let i = 0; i < proverbsData.length; i += batchSize) {
      const batch = proverbsData.slice(i, i + batchSize);
      const values = batch.map(proverb => 
        `('${escapeString(proverb.proverb)}', '${escapeString(proverb.translation.ru)}', '${escapeString(proverb.translation.kk)}', '${escapeString(proverb.translation.en)}')`
      ).join(',');
      
      const sql = `INSERT INTO proverbs (proverb, translation_ru, translation_kk, translation_en) VALUES ${values}`;
      await db.execAsync(sql);
    }

    // Проверяем количество записей
    const countResult = await db.getAllAsync('SELECT COUNT(*) as count FROM proverbs');
    const count = (countResult[0] as CountRow).count;

    if (count === 0) {
      throw new Error('Database is still empty after initialization');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const initProverbsDatabase = (callback: SQLiteCallback) => {
  initializeDatabase()
    .then(() => {
      callback(null);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      callback(error instanceof Error ? error : new Error(String(error)));
    });
};

// Получение всех пословиц
export const getAllProverbs = (callback: SQLiteResultCallback) => {
  db.getAllAsync('SELECT * FROM proverbs')
    .then((rows) => {
      const proverbs = (rows as SQLiteRow[]).map(row => ({
        id: row.id,
        proverb: row.proverb,
        translation: {
          ru: row.translation_ru,
          kk: row.translation_kk,
          en: row.translation_en,
        },
      }));
      callback(null, proverbs);
    })
    .catch((error) => {
      console.error('Error getting proverbs:', error);
      callback(error instanceof Error ? error : new Error(String(error)), null);
    });
};

// Получение количества пословиц
export const getProverbCount = (callback: SQLiteResultCallback) => {
  db.getAllAsync('SELECT COUNT(*) as count FROM proverbs')
    .then((rows) => {
      const count = (rows[0] as CountRow).count;
      callback(null, count);
    })
    .catch((error) => {
      console.error('Error getting proverb count:', error);
      callback(error instanceof Error ? error : new Error(String(error)), null);
    });
};

// Добавление новой пословицы
export const addProverb = async (proverb: Omit<Proverb, 'id'>, callback: SQLiteResultCallback) => {
  try {
    const sql = `INSERT INTO proverbs (proverb, translation_ru, translation_kk, translation_en) VALUES ('${escapeString(proverb.proverb)}', '${escapeString(proverb.translation.ru)}', '${escapeString(proverb.translation.kk)}', '${escapeString(proverb.translation.en)}')`;
    await db.execAsync(sql);
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
    // Экранируем специальные символы в поисковом запросе
    const safeQuery = query.replace(/'/g, "''").replace(/%/g, '\\%').replace(/_/g, '\\_');
    const searchQuery = `%${safeQuery}%`;
    
    // Используем параметризованный запрос
    const sql = `SELECT * FROM proverbs 
      WHERE proverb LIKE ? 
      OR translation_ru LIKE ? 
      OR translation_kk LIKE ? 
      OR translation_en LIKE ?`;
      
    const rows = await db.getAllAsync(sql, [searchQuery, searchQuery, searchQuery, searchQuery]);
    const proverbs = (rows as SQLiteRow[]).map(row => ({
      id: row.id,
      proverb: row.proverb,
      translation: {
        ru: row.translation_ru,
        kk: row.translation_kk,
        en: row.translation_en,
      },
    }));
    callback(null, proverbs);
  } catch (error) {
    console.error('Error searching proverbs:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
}; 