import type { ITask, ITaskData } from '$lib/models/types';

export class Task implements ITask {
	readonly id: string;
	name: string = $state('');
	done: boolean = $state(false);
	createdAt: Date;
	updatedAt: Date;

	private constructor(params: PickElsePartial<ITaskData, 'name'>) {
		this.id = params.id ?? crypto.randomUUID();
		this.name = params.name;
		this.done = params.done ?? false;
		this.createdAt = params.createdAt ?? new Date();
		this.updatedAt = params.updatedAt ?? new Date();
	}

	static from(params: PickElsePartial<ITaskData, 'name'>) {
		return new Task(params);
	}

	clone() {
		const task = new Task(this);
		return task;
	}

	complete() {
		this.done = !this.done;
	}

	toJSON() {
		return {
			name: this.name,
			id: this.id,
			done: this.done,
			createdAt: this.createdAt,
			updatedAt: this.updatedAt
		};
	}
}
