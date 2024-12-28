import Dexie from 'dexie';
import { DexieORM } from './dexie-orm';
import type { MyDexie } from './types';

const dexie = new Dexie('dyndydyd') as MyDexie;

// Schema declaration:
dexie.version(1).stores({
	tasks: '&id, name, done, createdAt, updatedAt' // primary key "id" (for the runtime!)
});

const db = new DexieORM(dexie);
export default db;
