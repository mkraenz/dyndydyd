import type Dexie from 'dexie';
import type { EntityTable } from 'dexie';

interface DbTaskV2 {
	id: string;
	name: string;
	done: boolean;
	createdAt: Date;
	updatedAt: Date;
	sort: number;
}

export type DbTask = DbTaskV2;

export type MyDexie = Dexie & {
	tasks: EntityTable<
		DbTask,
		'id' // primary key "id" (for the typings only)
	>;
};
