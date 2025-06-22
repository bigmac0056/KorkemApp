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
  addProverb(proverb: Proverb): Promise<void>;
  searchProverbs(query: string): Promise<Proverb[]>;
  updateProverb(proverb: Proverb): Promise<void>;
  deleteProverb(id: number): Promise<void>;
  clearProverbs(): Promise<void>;
  clearDatabase(): Promise<void>;
}

export class SQLiteStorageAdapter implements StorageAdapter {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync('korkem.db');
  }

  async initDatabase(): Promise<void> {
    try {
      await this.db.execAsync(`
        CREATE TABLE IF NOT EXISTS phrases (
          id INTEGER PRIMARY KEY,
          phrase TEXT NOT NULL,
          translation_ru TEXT NOT NULL,
          translation_kk TEXT NOT NULL,
          translation_en TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS proverbs (
          id INTEGER PRIMARY KEY,
          proverb TEXT NOT NULL,
          translation_ru TEXT NOT NULL,
          translation_kk TEXT NOT NULL,
          translation_en TEXT NOT NULL
        );
      `);
    } catch (error) {
      console.error('Error initializing database:', error);
      throw error;
    }
  }

  async getPhrases(): Promise<Phrase[]> {
    try {
      const statement = await this.db.prepareAsync('SELECT * FROM phrases ORDER BY id;');
      const result = await statement.executeAsync();
      const rows = await result.getAllAsync();
      
      return rows.map((row: any) => ({
        id: row.id,
        phrase: row.phrase,
        translation: {
          ru: row.translation_ru,
          kk: row.translation_kk,
          en: row.translation_en
        }
      }));
    } catch (error) {
      console.error('Error getting phrases:', error);
      throw error;
    }
  }

  async searchPhrases(query: string): Promise<Phrase[]> {
    try {
      const searchQuery = `%${query}%`;
      const statement = await this.db.prepareAsync(`
        SELECT * FROM phrases 
        WHERE phrase LIKE ? 
        OR translation_ru LIKE ? 
        OR translation_kk LIKE ? 
        OR translation_en LIKE ?
        ORDER BY id;
      `);
      
      const result = await statement.executeAsync([searchQuery, searchQuery, searchQuery, searchQuery]);
      const rows = await result.getAllAsync();
      
      return rows.map((row: any) => ({
        id: row.id,
        phrase: row.phrase,
        translation: {
          ru: row.translation_ru,
          kk: row.translation_kk,
          en: row.translation_en
        }
      }));
    } catch (error) {
      console.error('Error searching phrases:', error);
      throw error;
    }
  }

  async loadPhrases(phrases: Phrase[]): Promise<void> {
    try {
      // Start a transaction
      await this.db.execAsync('BEGIN TRANSACTION;');
      
      // Clear the table
      await this.db.execAsync('DELETE FROM phrases;');
      
      // Try to reset the auto-increment counter, but don't fail if table doesn't exist
      try {
        await this.db.execAsync('DELETE FROM sqlite_sequence WHERE name="phrases";');
      } catch (error) {
        console.log('sqlite_sequence table not found, skipping reset');
      }
      
      // Insert new data
      for (const phrase of phrases) {
        const statement = await this.db.prepareAsync(
          'INSERT OR REPLACE INTO phrases (id, phrase, translation_ru, translation_kk, translation_en) VALUES (?, ?, ?, ?, ?);'
        );
        await statement.executeAsync([
          phrase.id,
          phrase.phrase,
          phrase.translation.ru,
          phrase.translation.kk,
          phrase.translation.en
        ]);
      }
      
      // Commit the transaction
      await this.db.execAsync('COMMIT;');
    } catch (error) {
      // Rollback on error
      await this.db.execAsync('ROLLBACK;');
      console.error('Error loading phrases:', error);
      throw error;
    }
  }

  async getAllProverbs(): Promise<Proverb[]> {
    try {
      const statement = await this.db.prepareAsync('SELECT * FROM proverbs ORDER BY id;');
      const result = await statement.executeAsync();
      const rows = await result.getAllAsync();
      
      return rows.map((row: any) => ({
        id: row.id,
        proverb: row.proverb,
        translation: {
          ru: row.translation_ru,
          kk: row.translation_kk,
          en: row.translation_en
        }
      }));
    } catch (error) {
      console.error('Error getting proverbs:', error);
      throw error;
    }
  }

  async addProverb(proverb: Proverb): Promise<void> {
    try {
      const statement = await this.db.prepareAsync(
        'INSERT INTO proverbs (id, proverb, translation_ru, translation_kk, translation_en) VALUES (?, ?, ?, ?, ?);'
      );
      await statement.executeAsync([
        proverb.id,
        proverb.proverb,
        proverb.translation.ru,
        proverb.translation.kk,
        proverb.translation.en
      ]);
    } catch (error) {
      console.error('Error adding proverb:', error);
      throw error;
    }
  }

  async searchProverbs(query: string): Promise<Proverb[]> {
    try {
      const searchQuery = `%${query}%`;
      const statement = await this.db.prepareAsync(`
        SELECT * FROM proverbs 
        WHERE proverb LIKE ? 
        OR translation_ru LIKE ? 
        OR translation_kk LIKE ? 
        OR translation_en LIKE ?
        ORDER BY id;
      `);
      
      const result = await statement.executeAsync([searchQuery, searchQuery, searchQuery, searchQuery]);
      const rows = await result.getAllAsync();
      
      return rows.map((row: any) => ({
        id: row.id,
        proverb: row.proverb,
        translation: {
          ru: row.translation_ru,
          kk: row.translation_kk,
          en: row.translation_en
        }
      }));
    } catch (error) {
      console.error('Error searching proverbs:', error);
      throw error;
    }
  }

  async updateProverb(proverb: Proverb): Promise<void> {
    try {
      const statement = await this.db.prepareAsync(`
        UPDATE proverbs 
        SET proverb = ?, translation_ru = ?, translation_kk = ?, translation_en = ?
        WHERE id = ?;
      `);
      await statement.executeAsync([
        proverb.proverb,
        proverb.translation.ru,
        proverb.translation.kk,
        proverb.translation.en,
        proverb.id
      ]);
    } catch (error) {
      console.error('Error updating proverb:', error);
      throw error;
    }
  }

  async deleteProverb(id: number): Promise<void> {
    try {
      const statement = await this.db.prepareAsync('DELETE FROM proverbs WHERE id = ?;');
      await statement.executeAsync([id]);
    } catch (error) {
      console.error('Error deleting proverb:', error);
      throw error;
    }
  }

  async clearProverbs(): Promise<void> {
    try {
      await this.db.execAsync('DELETE FROM proverbs;');
      
      // Try to reset auto-increment counters, but don't fail if table doesn't exist
      try {
        await this.db.execAsync('DELETE FROM sqlite_sequence WHERE name="proverbs";');
      } catch (error) {
        console.log('sqlite_sequence table not found, skipping reset');
      }
      
      console.log('Proverbs cleared successfully');
    } catch (error) {
      console.error('Error clearing proverbs:', error);
      throw error;
    }
  }

  async clearDatabase(): Promise<void> {
    try {
      await this.db.execAsync('DELETE FROM phrases;');
      await this.db.execAsync('DELETE FROM proverbs;');
      
      // Try to reset auto-increment counters, but don't fail if table doesn't exist
      try {
        await this.db.execAsync('DELETE FROM sqlite_sequence WHERE name="phrases";');
        await this.db.execAsync('DELETE FROM sqlite_sequence WHERE name="proverbs";');
      } catch (error) {
        console.log('sqlite_sequence table not found, skipping reset');
      }
      
      console.log('Database cleared successfully');
    } catch (error) {
      console.error('Error clearing database:', error);
      throw error;
    }
  }

  async clearPhrases(): Promise<void> {
    try {
      await this.db.execAsync('DELETE FROM phrases;');
      
      // Try to reset auto-increment counters, but don't fail if table doesn't exist
      try {
        await this.db.execAsync('DELETE FROM sqlite_sequence WHERE name="phrases";');
      } catch (error) {
        console.log('sqlite_sequence table not found, skipping reset');
      }
      
      console.log('Phrases cleared successfully');
    } catch (error) {
      console.error('Error clearing phrases:', error);
      throw error;
    }
  }
}

// Create and export a single instance of the storage adapter
export const storage = new SQLiteStorageAdapter(); 