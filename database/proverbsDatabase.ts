import * as SQLite from 'expo-sqlite';
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

const db = SQLite.openDatabaseSync('proverbs.db');

// Функция для экранирования строк в SQL
const escapeString = (str: string): string => {
  return str.replace(/'/g, "''");
};

// Создаем таблицу и загружаем данные
export const initProverbsDatabase = async (callback: (error: Error | null) => void) => {
  try {
    // Создаем таблицу
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS proverbs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        proverb TEXT NOT NULL,
        translation_ru TEXT NOT NULL,
        translation_kk TEXT NOT NULL,
        translation_en TEXT NOT NULL
      );
    `);

    // Проверяем количество записей
    const result = await db.getAllAsync('SELECT COUNT(*) as count FROM proverbs');
    const count = result[0]?.count || 0;

    if (count === 0) {
      // Добавляем начальные данные
      const initialProverbs = [
        {
          proverb: 'Алтын қазық',
          translation_ru: 'Золотой кол',
          translation_kk: 'Алтын қазық',
          translation_en: 'Golden stake'
        },
        {
          proverb: 'Білгенге маржан',
          translation_ru: 'Знание - жемчужина',
          translation_kk: 'Білгенге маржан',
          translation_en: 'Knowledge is a pearl'
        }
      ];

      for (const proverb of initialProverbs) {
        await db.execAsync(`
          INSERT INTO proverbs (proverb, translation_ru, translation_kk, translation_en)
          VALUES (?, ?, ?, ?);
        `, [proverb.proverb, proverb.translation_ru, proverb.translation_kk, proverb.translation_en]);
      }
    }
    callback(null);
  } catch (error) {
    console.error('Database initialization error:', error);
    callback(error instanceof Error ? error : new Error(String(error)));
  }
};

// Получение всех пословиц
export const getAllProverbs = async (callback: (error: Error | null, result: Proverb[]) => void) => {
  try {
    const rows = await db.getAllAsync('SELECT * FROM proverbs');
    const proverbs: Proverb[] = rows.map((row: any) => ({
      id: row.id,
      proverb: row.proverb,
      translation: {
        ru: row.translation_ru,
        kk: row.translation_kk,
        en: row.translation_en
      }
    }));
    callback(null, proverbs);
  } catch (error) {
    console.error('Error getting proverbs:', error);
    callback(error instanceof Error ? error : new Error(String(error)), []);
  }
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
export const searchProverbs = async (query: string, callback: (error: Error | null, result: Proverb[]) => void) => {
  try {
    const searchQuery = `%${query}%`;
    const rows = await db.getAllAsync(`
      SELECT * FROM proverbs 
      WHERE proverb LIKE ? 
      OR translation_ru LIKE ? 
      OR translation_kk LIKE ? 
      OR translation_en LIKE ?;
    `, [searchQuery, searchQuery, searchQuery, searchQuery]);

    const proverbs: Proverb[] = rows.map((row: any) => ({
      id: row.id,
      proverb: row.proverb,
      translation: {
        ru: row.translation_ru,
        kk: row.translation_kk,
        en: row.translation_en
      }
    }));
    callback(null, proverbs);
  } catch (error) {
    console.error('Error searching proverbs:', error);
    callback(error instanceof Error ? error : new Error(String(error)), []);
  }
}; 