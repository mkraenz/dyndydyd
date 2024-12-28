import type { DexieORM } from '$lib/db/dexie-orm';
import type { Filter, ITask } from '$lib/models/types';
import partition from 'lodash/partition';
import { getContext, setContext } from 'svelte';

export class TasksState {
	#tasks = $state<ITask[]>([]);
	#db: DexieORM;

	filter = $state<Filter>('all');
	#doneAtBottom = $state(false);

	private halfwaySortedTasks = $derived.by(() => {
		if (!this.doneAtBottom) return this.#tasks;
		const [done, other] = partition(this.#tasks, (t) => t.done);
		return [...other, ...done];
	});

	#filteredTasks = $derived.by(() => {
		switch (this.filter) {
			case 'done':
				return this.halfwaySortedTasks.filter((t) => t.done);
			case 'todo':
				return this.halfwaySortedTasks.filter((t) => !t.done);
			case 'all':
			default:
				return this.halfwaySortedTasks;
		}
	});

	get filteredTasks() {
		return this.#filteredTasks;
	}

	get allTasks() {
		return this.#tasks;
	}

	get doneAtBottom() {
		return this.#doneAtBottom;
	}

	constructor({ tasks, db }: { tasks: ITask[]; db: DexieORM }) {
		this.#tasks = tasks;
		this.#db = db;
	}

	async addTask(task: ITask) {
		this.#tasks = [task, ...this.#tasks];
		await this.#db.tasks.create(task.toJSON()); // using .toJSON since dexie doesn't like getter props which are used heavily with svelte runes. This dexie behavior seems to be inherited from indexedDb https://stackoverflow.com/a/65135601
	}

	async removeTask(id: string) {
		this.#tasks = this.#tasks.filter((t) => t.id !== id);
		await this.#db.tasks.remove(id);
	}

	async toggleDone(task: ITask) {
		task.complete();
		await this.#db.tasks.update(task, { done: task.done });
	}

	async setTaskName(task: ITask, name: string) {
		task.name = name;
		await this.#db.tasks.update(task.id, { name });
	}

	toggleDoneAtBottom(forceVal?: boolean) {
		if (forceVal !== undefined) this.#doneAtBottom = forceVal;
		else this.#doneAtBottom = !this.#doneAtBottom;
	}
}

const key = Symbol('tasks');

export function setTasksContext(...params: ConstructorParameters<typeof TasksState>) {
	const state = new TasksState(...params);
	return setContext(key, state);
}
export function getTasksContext() {
	return getContext<ReturnType<typeof setTasksContext>>(key);
}
