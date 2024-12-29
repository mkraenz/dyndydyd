import type { DexieORM } from '$lib/db/dexie-orm';
import type { Filter, ITask } from '$lib/models/types';
import partition from 'lodash/partition';
import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

export class TasksState {
	#tasks = $state<ITask[]>([]);
	#normalizedTasks = new SvelteMap<string, ITask>();
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

	get totalTasks() {
		return this.#tasks.length;
	}

	get filteredTasks() {
		return this.#filteredTasks;
	}

	get allTasks() {
		return this.#tasks;
	}

	set allTasks(val: ITask[]) {
		this.#tasks = val;
		this.#normalizedTasks.clear();
		val.forEach((task) => this.#normalizedTasks.set(task.id, task));
	}

	async moveTask(id: string, newTasks: ITask[]) {
		const movedTask = this.#normalizedTasks.get(id);
		if (!movedTask) throw new Error(`Called moveTask with non-existent id: ${id}`);

		const toIndex = newTasks.findIndex((t) => t.id === id);
		const prev = this.#tasks[toIndex - 1];
		const next = this.#tasks[toIndex + 1];
		const sort =
			prev && next
				? (next.sort + prev.sort) / 2
				: prev
					? prev.sort - 1000
					: next
						? next.sort + 1000
						: 1000;
		movedTask.sort = sort;
		this.allTasks = newTasks;
		await this.#db.tasks.update(movedTask.id, { sort });
	}

	get normalizedTasks() {
		return this.#normalizedTasks;
	}

	get doneAtBottom() {
		return this.#doneAtBottom;
	}

	constructor({ tasks, db }: { tasks: ITask[]; db: DexieORM }) {
		this.allTasks = tasks;
		this.#db = db;
	}

	get first() {
		return this.#tasks[0];
	}

	async addTask(task: PickedPartial<ITask, 'sort'>) {
		const addedTask = { ...task, sort: this.first?.sort ?? 0 - 1000 };
		this.#tasks = [addedTask, ...this.#tasks];
		this.#normalizedTasks.set(task.id, addedTask);
		await this.#db.tasks.create(addedTask);
	}

	async removeTask(id: string) {
		this.#tasks = this.#tasks.filter((t) => t.id !== id);
		this.#normalizedTasks.delete(id);
		await this.#db.tasks.remove(id);
	}

	async toggleDone(task: ITask) {
		task.done = !task.done;
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
