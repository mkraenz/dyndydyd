export type ITaskData = {
	id: string;
	name: string;
	done: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type ITask = ITaskData & {
	complete(): void;
	toJSON(): ITaskData;
};
export type Filter = 'all' | 'done' | 'todo';
