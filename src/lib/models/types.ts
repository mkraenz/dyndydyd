export type ITaskData = {
	id: string;
	name: string;
	done: boolean;
	createdAt: Date;
	updatedAt: Date;
	sort: number;
};

export type ITask = ITaskData;
export type Filter = 'all' | 'done' | 'todo';
