export type ITask = {
	id: string;
	name: string;
	done: boolean;
	complete(): void;
};
export type Filter = 'all' | 'done' | 'todo';
