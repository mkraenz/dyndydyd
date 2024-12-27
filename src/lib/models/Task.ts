import type { ITask } from '$lib/types';

export class Task implements ITask {
	readonly id: string;
	name: string;
	done: boolean;

	constructor({ name, id, done }: PickElsePartial<ITask, 'name'>) {
		this.id = id ?? crypto.randomUUID();
		this.name = name;
		this.done = done ?? false;
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
			done: this.done
		};
	}
}
