import { Task } from '$lib/models/Task.svelte';
import type { PartialDeep } from 'type-fest';
import type { DbTask, MyDexie } from './types';

type FindAllOptions<T extends object> = Partial<{
	limit: number;
	orderBy: keyof T;
	offset: number;
}>;
const defaultFindAllOptions = {
	limit: 50,
	orderBy: 'updatedAt',
	offset: 0
} satisfies FindAllOptions<DbTask>;

export class DexieORM {
	tasks: TasksRepository;

	constructor(db: MyDexie) {
		this.tasks = new TasksRepository(db);
	}
}

class TasksRepository {
	#db: MyDexie;

	constructor(db: MyDexie) {
		this.#db = db;
	}

	newEntity(...params: Parameters<typeof Task.from>) {
		return Task.from(...params);
	}

	/** Warning: IndexedDB and, by extension, dexie do not respect getter props. Hence, call `toJSON()` before  */
	async create(data: WithPartialId<DbTask>) {
		const id = await this.#db.tasks.add(data);
		return Task.from({ ...data, id });
	}

	async findOne(id: string) {
		const entity = await this.#db.tasks.get(id);
		if (!entity) return null;
		return Task.from(entity);
	}

	async findAll(opts?: FindAllOptions<DbTask>) {
		const { orderBy, limit, offset } = { ...defaultFindAllOptions, ...opts };
		const entities = await this.#db.tasks.orderBy(orderBy).limit(limit).offset(offset).toArray();
		return entities.map(Task.from);
	}

	async update(taskOrId: string | DbTask, changes: PartialDeep<DbTask>) {
		const key = typeof taskOrId === 'string' ? taskOrId : taskOrId.id;
		await this.#db.tasks.update(key, changes);
		return this.findOne(key);
	}

	async remove(id: string) {
		await this.#db.tasks.delete(id);
	}
}
