import { SQLiteDatabase as ExpoSQLiteDatabase } from 'expo-sqlite';

export interface SQLiteTransaction {
  executeSql(
    sqlStatement: string,
    args?: any[],
    callback?: (transaction: SQLiteTransaction, resultSet: SQLiteResultSet) => void,
    errorCallback?: (transaction: SQLiteTransaction, error: Error) => boolean
  ): void;
}

export interface SQLiteResultSet {
  insertId?: number;
  rowsAffected: number;
  rows: {
    length: number;
    item(index: number): any;
    _array: any[];
  };
}

// Use the ExpoSQLiteDatabase type directly since it already includes the transaction method
export type SQLiteDatabase = ExpoSQLiteDatabase;

export interface Translation {
  ru: string;
  kk: string;
  en: string;
}

export type Phrase = {
  id: number;
  phrase: string;
  translation: Translation;
};

export type Proverb = {
  id: number;
  proverb: string;
  translation: Translation;
}; 