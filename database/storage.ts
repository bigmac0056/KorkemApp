import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';
import { SQLiteDatabase, SQLiteTransaction, Phrase } from './types';

// Типы данных
export interface Translation {
  ru: string;
  kk: string;
  en: string;
}

export interface Proverb {
  id: number;
  proverb: string;
  translation: Translation;
}

// Интерфейс для адаптера хранилища
export interface StorageAdapter {
  initDatabase(): Promise<void>;
  getPhrases(): Promise<Phrase[]>;
  searchPhrases(query: string): Promise<Phrase[]>;
  loadPhrases(phrases: Phrase[]): Promise<void>;
  clearPhrases(): Promise<void>;
  getAllProverbs(): Promise<Proverb[]>;
  loadProverbs(proverbs: Proverb[]): Promise<void>;
  addProverb(proverb: Proverb): Promise<void>;
  searchProverbs(query: string): Promise<Proverb[]>;
  updateProverb(proverb: Proverb): Promise<void>;
  deleteProverb(id: number): Promise<void>;
  clearProverbs(): Promise<void>;
  clearDatabase(): Promise<void>;
}

export class SQLiteStorageAdapter implements StorageAdapter {
  private static db: SQLite.SQLiteDatabase | null = null;

  private async getDb(): Promise<SQLite.SQLiteDatabase> {
    if (SQLiteStorageAdapter.db) {
      return SQLiteStorageAdapter.db;
    }
    SQLiteStorageAdapter.db = await SQLite.openDatabaseAsync('korkem.db');
    await this.initTables(SQLiteStorageAdapter.db);
    return SQLiteStorageAdapter.db;
  }

  private async initTables(db: SQLite.SQLiteDatabase): Promise<void> {
    // await db.execAsync(`PRAGMA journal_mode = WAL;`); // Удалено для совместимости с web
    await db.execAsync(`CREATE TABLE IF NOT EXISTS phrases (
      id INTEGER PRIMARY KEY NOT NULL,
      phrase TEXT NOT NULL,
      translation_ru TEXT,
      translation_kk TEXT,
      translation_en TEXT
    );`);
    await db.execAsync(`CREATE TABLE IF NOT EXISTS proverbs (
      id INTEGER PRIMARY KEY NOT NULL,
      proverb TEXT NOT NULL,
      translation_ru TEXT,
      translation_kk TEXT,
      translation_en TEXT
    );`);
  }
  
  async initDatabase(): Promise<void> {
    // Просто вызывает getDb для инициализации, если это еще не сделано
    await this.getDb();
  }
  
  async getPhrases(): Promise<Phrase[]> {
    const db = await this.getDb();
    const rows = await db.getAllAsync<any>('SELECT * FROM phrases ORDER BY id;');
    return rows.map(row => ({
        id: row.id,
        phrase: row.phrase,
        translation: {
          ru: row.translation_ru,
          kk: row.translation_kk,
          en: row.translation_en
        }
      }));
  }

  async searchPhrases(query: string): Promise<Phrase[]> {
    const db = await this.getDb();
    const searchQuery = `%${query}%`;
    const rows = await db.getAllAsync<any>(
      'SELECT * FROM phrases WHERE phrase LIKE ? OR translation_ru LIKE ? OR translation_kk LIKE ? OR translation_en LIKE ? ORDER BY id;',
      [searchQuery, searchQuery, searchQuery, searchQuery]
    );
    return rows.map((row: any) => ({
      id: row.id,
      phrase: row.phrase,
      translation: {
        ru: row.translation_ru,
        kk: row.translation_kk,
        en: row.translation_en
      }
    }));
  }
  
  async loadPhrases(phrases: Phrase[]): Promise<void> {
      const db = await this.getDb();
      await db.withTransactionAsync(async () => {
        for (const phrase of phrases) {
            await db.runAsync(
              'INSERT OR REPLACE INTO phrases (id, phrase, translation_ru, translation_kk, translation_en) VALUES (?, ?, ?, ?, ?);',
              [phrase.id, phrase.phrase, phrase.translation.ru, phrase.translation.kk, phrase.translation.en]
            );
        }
      });
  }
  
  async clearPhrases(): Promise<void> {
    const db = await this.getDb();
    await db.runAsync('DELETE FROM phrases;');
    try {
      await db.runAsync('DELETE FROM sqlite_sequence WHERE name="phrases";');
    } catch (error) {
      // Игнорируем ошибку, если таблица не существует
    }
  }

  async getAllProverbs(): Promise<Proverb[]> {
    const db = await this.getDb();
    const rows = await db.getAllAsync<any>('SELECT * FROM proverbs ORDER BY id;');
    return rows.map((row: any) => ({
      id: row.id,
      proverb: row.proverb,
      translation: {
        ru: row.translation_ru,
        kk: row.translation_kk,
        en: row.translation_en
      }
    }));
  }

  async loadProverbs(proverbs: Proverb[]): Promise<void> {
    const db = await this.getDb();
    for (const proverb of proverbs) {
      console.log('[DB] Inserting proverb:', JSON.stringify(proverb));
      await this.addProverb(proverb);
    }
  }

  async addProverb(proverb: Proverb): Promise<void> {
    const db = await this.getDb();
    await db.runAsync(
      'INSERT OR REPLACE INTO proverbs (id, proverb, translation_ru, translation_kk, translation_en) VALUES (?, ?, ?, ?, ?);',
      [proverb.id, proverb.proverb, proverb.translation.ru, proverb.translation.kk, proverb.translation.en]
    );
  }

  async searchProverbs(query: string): Promise<Proverb[]> {
    const db = await this.getDb();
    const searchQuery = `%${query}%`;
    const rows = await db.getAllAsync<any>(
      'SELECT * FROM proverbs WHERE proverb LIKE ? OR translation_ru LIKE ? OR translation_kk LIKE ? OR translation_en LIKE ? ORDER BY id;',
      [searchQuery, searchQuery, searchQuery, searchQuery]
    );
    return rows.map((row: any) => ({
      id: row.id,
      proverb: row.proverb,
      translation: {
        ru: row.translation_ru,
        kk: row.translation_kk,
        en: row.translation_en
      }
    }));
  }

  async updateProverb(proverb: Proverb): Promise<void> {
    const db = await this.getDb();
    await db.runAsync(
      'UPDATE proverbs SET proverb = ?, translation_ru = ?, translation_kk = ?, translation_en = ? WHERE id = ?;',
      [proverb.proverb, proverb.translation.ru, proverb.translation.kk, proverb.translation.en, proverb.id]
    );
  }

  async deleteProverb(id: number): Promise<void> {
    const db = await this.getDb();
    await db.runAsync('DELETE FROM proverbs WHERE id = ?;', [id]);
  }

  async clearProverbs(): Promise<void> {
    const db = await this.getDb();
    await db.runAsync('DELETE FROM proverbs;');
    try {
      await db.runAsync('DELETE FROM sqlite_sequence WHERE name="proverbs";');
    } catch (error) {
      // Игнорируем ошибку, если таблица не существует
    }
  }

  async clearDatabase(): Promise<void> {
    const db = await this.getDb();
    await db.runAsync('DELETE FROM phrases;');
    await db.runAsync('DELETE FROM proverbs;');
    try {
      await db.runAsync('DELETE FROM sqlite_sequence WHERE name="phrases";');
      await db.runAsync('DELETE FROM sqlite_sequence WHERE name="proverbs";');
    } catch (error) {
      // Игнорируем ошибку, если таблицы не существуют
    }
  }
}

// Create and export a single instance of the storage adapter
export const storage = new SQLiteStorageAdapter(); 