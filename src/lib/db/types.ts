import type Dexie from 'dexie';
import type { EntityTable } from 'dexie';

interface DbTaskV1 {
	id: string;
	name: string;
	done: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export type DbTask = DbTaskV1;

export type MyDexie = Dexie & {
	tasks: EntityTable<
		DbTask,
		'id' // primary key "id" (for the typings only)
	>;
};
