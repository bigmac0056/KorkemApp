import * as SQLite from 'expo-sqlite';
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

// Используем openDatabaseSync, так как это единственный доступный метод
const db = SQLite.openDatabaseSync('phrases.db');

// Функция для экранирования строк в SQL
const escapeString = (str: string): string => {
  return str.replace(/'/g, "''");
};

// Создаем таблицу и загружаем данные
const initializeDatabase = async () => {
  try {
    // Удаляем таблицу, если она существует
    await db.execAsync('DROP TABLE IF EXISTS phrases');
    
    // Создаем таблицу
    await db.execAsync(`CREATE TABLE phrases (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      phrase TEXT NOT NULL,
      translation_ru TEXT NOT NULL,
      translation_kk TEXT NOT NULL,
      translation_en TEXT NOT NULL
    )`);

    // Загружаем все фразы из JSON
    const batchSize = 100;
    for (let i = 0; i < phrasesData.length; i += batchSize) {
      const batch = phrasesData.slice(i, i + batchSize);
      const values = batch.map(phrase => 
        `('${escapeString(phrase.phrase)}', '${escapeString(phrase.translation.ru)}', '${escapeString(phrase.translation.kk)}', '${escapeString(phrase.translation.en)}')`
      ).join(',');
      
      const sql = `INSERT INTO phrases (phrase, translation_ru, translation_kk, translation_en) VALUES ${values}`;
      await db.execAsync(sql);
    }

    // Проверяем количество записей
    const countResult = await db.getAllAsync('SELECT COUNT(*) as count FROM phrases');
    const count = (countResult[0] as CountRow).count;

    if (count === 0) {
      throw new Error('Database is still empty after initialization');
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const initDatabase = (callback: SQLiteCallback) => {
  initializeDatabase()
    .then(() => {
      callback(null);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      callback(error instanceof Error ? error : new Error(String(error)));
    });
};

// Получение всех фраз
export const getAllPhrases = (callback: SQLiteResultCallback) => {
  db.getAllAsync('SELECT * FROM phrases')
    .then((rows) => {
      const phrases = (rows as SQLiteRow[]).map(row => ({
        id: row.id,
        phrase: row.phrase,
        translation: {
          ru: row.translation_ru,
          kk: row.translation_kk,
          en: row.translation_en,
        },
      }));
      callback(null, phrases);
    })
    .catch((error) => {
      console.error('Error getting phrases:', error);
      callback(error instanceof Error ? error : new Error(String(error)), null);
    });
};

// Получение количества фраз
export const getPhraseCount = (callback: SQLiteResultCallback) => {
  db.getAllAsync('SELECT COUNT(*) as count FROM phrases')
    .then((rows) => {
      const count = (rows[0] as CountRow).count;
      callback(null, count);
    })
    .catch((error) => {
      console.error('Error getting phrase count:', error);
      callback(error instanceof Error ? error : new Error(String(error)), null);
    });
};

// Добавление новой фразы
export const addPhrase = async (phrase: Omit<Phrase, 'id'>, callback: SQLiteResultCallback) => {
  try {
    const sql = `INSERT INTO phrases (phrase, translation_ru, translation_kk, translation_en) VALUES ('${escapeString(phrase.phrase)}', '${escapeString(phrase.translation.ru)}', '${escapeString(phrase.translation.kk)}', '${escapeString(phrase.translation.en)}')`;
    await db.execAsync(sql);
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
    // Экранируем специальные символы в поисковом запросе
    const safeQuery = query.replace(/'/g, "''").replace(/%/g, '\\%').replace(/_/g, '\\_');
    const searchQuery = `%${safeQuery}%`;
    
    // Используем параметризованный запрос
    const sql = `SELECT * FROM phrases 
      WHERE phrase LIKE ? 
      OR translation_ru LIKE ? 
      OR translation_kk LIKE ? 
      OR translation_en LIKE ?`;
      
    const rows = await db.getAllAsync(sql, [searchQuery, searchQuery, searchQuery, searchQuery]);
    const phrases = (rows as SQLiteRow[]).map(row => ({
      id: row.id,
      phrase: row.phrase,
      translation: {
        ru: row.translation_ru,
        kk: row.translation_kk,
        en: row.translation_en,
      },
    }));
    callback(null, phrases);
  } catch (error) {
    console.error('Error searching phrases:', error);
    callback(error instanceof Error ? error : new Error(String(error)), null);
  }
};