import type { DexieORM } from '$lib/db/dexie-orm';
import type { Filter, ITask } from '$lib/models/types';
import { getContext, setContext } from 'svelte';
import { SvelteMap } from 'svelte/reactivity';

export class TasksState {
	#tasks = $state<ITask[]>([]);
	#normalizedTasks = new SvelteMap<string, ITask>();
	#db: DexieORM;

	filter = $state<Filter>('all');
	#doneAtBottom = $state(false);
	dragging = false;

	filteredTasks = $derived(this.doneAtBottom ? this.openTasks : this.#tasks);

	get totalTasks() {
		return this.#tasks.length;
	}

	get allTasks() {
		return this.#tasks;
	}

	get doneTasks() {
		return this.#tasks.filter((t) => t.done);
	}

	get openTasks() {
		return this.#tasks.filter((t) => !t.done);
	}

	get totalTasksDone() {
		return this.doneTasks.length;
	}

	set allTasks(val: ITask[]) {
		this.#tasks = this.dragging ? val : val.toSorted(bySortScore);
		this.#normalizedTasks.clear();
		val.forEach((task) => this.#normalizedTasks.set(task.id, task));
	}

	get normalizedTasks() {
		return this.#normalizedTasks;
	}

	get doneAtBottom() {
		return this.#doneAtBottom;
	}

	get first() {
		return this.#tasks[0];
	}

	constructor({ tasks, db }: { tasks: ITask[]; db: DexieORM }) {
		this.allTasks = tasks;
		this.#db = db;
	}

	async addTask(task: PickedPartial<ITask, 'sort'>) {
		const addedTask = { ...task, sort: (this.first?.sort ?? 1000) - 1000 };
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

	async moveTask(id: string, newTasks: ITask[]) {
		const toIndex = newTasks.findIndex((t) => t.id === id);
		const movedTask = newTasks[toIndex];
		const next = newTasks[toIndex + 1];
		const prev = newTasks[toIndex - 1];
		const sort = getSortScore();
		movedTask.sort = sort;
		this.allTasks = this.doneAtBottom
			? [...newTasks, ...this.doneTasks].toSorted(bySortScore)
			: newTasks.toSorted(bySortScore);
		await this.#db.tasks.update(movedTask.id, { sort });

		function getSortScore() {
			if (next && prev) return (prev.sort + next.sort) / 2;
			// this means that we add at the very start of the list
			if (next) return next.sort - 1000;
			// this means that we add at the very end of the list
			if (prev) return prev.sort + 1000;
			return 1000;
		}
	}

	uncheckAll() {
		const doneTasks = this.doneTasks;
		doneTasks.forEach((t) => (t.done = false));
		this.#db.tasks.updateMany(
			doneTasks.map((t) => t.id),
			{ done: false }
		);
	}

	async loadAllTasks() {
		const allTasks = await this.#db.tasks.findAll({ limit: Number.MAX_SAFE_INTEGER });
		this.allTasks = allTasks;
	}
}

const key = Symbol('tasks');

function bySortScore(a: ITask, b: ITask) {
	return a.sort - b.sort;
}

export function setTasksContext(...params: ConstructorParameters<typeof TasksState>) {
	const state = new TasksState(...params);
	return setContext(key, state);
}
export function getTasksContext() {
	return getContext<ReturnType<typeof setTasksContext>>(key);
}
