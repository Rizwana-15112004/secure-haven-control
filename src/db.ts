import Dexie, { type Table } from 'dexie';

export interface SOSMessage {
  id?: number;
  staffName: string;
  floor: string;
  injured: string;
  details: string;
  timestamp: number;
}

export class MyDatabase extends Dexie {
  sosQueue!: Table<SOSMessage>;

  constructor() {
    super('SecureHavenDB');
    this.version(1).stores({
      sosQueue: '++id, timestamp' // Primary key and indexed props
    });
  }
}

export const db = new MyDatabase();