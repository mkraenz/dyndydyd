import type { ITask, ITaskData } from '$lib/models/types';

export class Task implements Omit<ITask, 'sort'> {
	readonly id: string;
	name: string = $state('');
	done: boolean = $state(false);
	createdAt: Date;
	updatedAt: Date;
	sort?: number;

	private constructor(params: PickElsePartial<ITaskData, 'name'>) {
		this.id = params.id ?? crypto.randomUUID();
		this.name = params.name;
		this.done = params.done ?? false;
		this.createdAt = params.createdAt ?? new Date();
		this.updatedAt = params.updatedAt ?? new Date();
		this.sort = params.sort;
	}

	static from(params: PickElsePartial<ITaskData, 'name'>) {
		return new Task(params);
	}

	static toJSON(task: Task) {
		return task.toJSON();
	}

	clone() {
		const task = new Task(this);
		return task;
	}

	complete() {
		this.done = !this.done;
	}

	toJSON(): ITaskData {
		return {
			name: this.name,
			id: this.id,
			done: this.done,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt,
			// @ts-expect-error -- TODO #1
			sort: this.sort
		};
	}
}
