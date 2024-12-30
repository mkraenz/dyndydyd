import type { DexieORM } from '$lib/db/dexie-orm';
import type { ITask } from '$lib/models/types';
import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { TasksState } from './TasksState.svelte';

const makeTask = (overwrites: Partial<ITask>) => {
	const base = {
		id: 'tid-1',
		sort: 0,
		name: '1',
		done: false,
		createdAt: new Date(),
		updatedAt: new Date()
	};
	return { ...base, ...overwrites };
};

let db: DexieORM;

beforeEach(() => {
	db = { tasks: { update: vitest.fn() } as any };
});

it('returns the all tasks in filteredTasks and none doneTasks when all tasks are open', () => {
	const task1: ITask = makeTask({ id: 'tid-1', sort: 0, name: '1' });
	const task2: ITask = makeTask({ id: 'tid-2', sort: 1000, name: '2' });
	const task3: ITask = makeTask({ id: 'tid-3', sort: 2000, name: '3' });
	const tasks: ITask[] = [task1, task2, task3];
	const state = new TasksState({ db, tasks });

	expect(state.filteredTasks).toMatchObject([{ id: 'tid-1' }, { id: 'tid-2' }, { id: 'tid-3' }]);
	expect(state.doneTasks).toEqual([]);
});

describe('moveTask(..)', () => {
	describe('move to original position', () => {
		it('calculates scores correctly when moving first position to itself', async () => {
			const task1: ITask = makeTask({ id: 'tid-1', sort: 0, name: '1' });
			const task2: ITask = makeTask({ id: 'tid-2', sort: 1000, name: '2' });
			const task3: ITask = makeTask({ id: 'tid-3', sort: 2000, name: '3' });
			const tasks: ITask[] = [task1, task2, task3];
			const state = new TasksState({ db, tasks });
			const newTasks = tasks;

			await state.moveTask('tid-1', newTasks);

			expect(state.filteredTasks).toMatchObject([
				{ id: 'tid-1', sort: 0 },
				{ id: 'tid-2' },
				{ id: 'tid-3' }
			]);
		});

		it('calculates scores correctly when moving second position to itself', async () => {
			const task1: ITask = makeTask({ id: 'tid-1', sort: 0, name: '1' });
			const task2: ITask = makeTask({ id: 'tid-2', sort: 1000, name: '2' });
			const task3: ITask = makeTask({ id: 'tid-3', sort: 2000, name: '3' });
			const tasks: ITask[] = [task1, task2, task3];
			const state = new TasksState({ db, tasks });
			const newTasks = tasks;

			await state.moveTask('tid-2', newTasks);

			expect(state.filteredTasks).toMatchObject([
				{ id: 'tid-1', sort: 0 },
				{ id: 'tid-2', sort: 1000 },
				{ id: 'tid-3', sort: 2000 }
			]);
		});

		it('calculates scores correctly when moving last position to itself', async () => {
			const task1: ITask = makeTask({ id: 'tid-1', sort: 0, name: '1' });
			const task2: ITask = makeTask({ id: 'tid-2', sort: 1000, name: '2' });
			const task3: ITask = makeTask({ id: 'tid-3', sort: 2000, name: '3' });
			const tasks: ITask[] = [task1, task2, task3];
			const state = new TasksState({ db, tasks });
			const newTasks = tasks;

			await state.moveTask('tid-3', newTasks);

			expect(state.filteredTasks).toMatchObject([
				{ id: 'tid-1', sort: 0 },
				{ id: 'tid-2', sort: 1000 },
				{ id: 'tid-3', sort: 2000 }
			]);
		});
	});

	describe('shift down by one', () => {
		it('calculates scores correctly when moving first position to second', async () => {
			const task1: ITask = makeTask({ id: 'tid-1', sort: 0, name: '1' });
			const task2: ITask = makeTask({ id: 'tid-2', sort: 1000, name: '2' });
			const task3: ITask = makeTask({ id: 'tid-3', sort: 2000, name: '3' });
			const tasks: ITask[] = [task1, task2, task3];
			const state = new TasksState({ db, tasks });
			const newTasks = [task2, task1, task3];

			await state.moveTask('tid-1', newTasks);

			expect(state.filteredTasks).toMatchObject([
				{ id: 'tid-2' },
				{ id: 'tid-1', sort: 1500 },
				{ id: 'tid-3' }
			]);
		});

		it('calculates scores correctly when moving second position to last', async () => {
			const task1: ITask = makeTask({ id: 'tid-1', sort: 0, name: '1' });
			const task2: ITask = makeTask({ id: 'tid-2', sort: 1000, name: '2' });
			const task3: ITask = makeTask({ id: 'tid-3', sort: 2000, name: '3' });
			const tasks: ITask[] = [task1, task2, task3];
			const state = new TasksState({ db, tasks });
			const newTasks = [task1, task3, task2];

			await state.moveTask('tid-2', newTasks);

			expect(state.filteredTasks).toMatchObject([
				{ id: 'tid-1', sort: 0 },
				{ id: 'tid-3', sort: 2000 },
				{ id: 'tid-2', sort: 3000 }
			]);
		});

		it('calculates scores correctly when moving last position to first', async () => {
			const task1: ITask = makeTask({ id: 'tid-1', sort: 0, name: '1' });
			const task2: ITask = makeTask({ id: 'tid-2', sort: 1000, name: '2' });
			const task3: ITask = makeTask({ id: 'tid-3', sort: 2000, name: '3' });
			const tasks: ITask[] = [task1, task2, task3];
			const state = new TasksState({ db, tasks });
			const newTasks = [task3, task1, task2];

			await state.moveTask('tid-3', newTasks);

			expect(state.filteredTasks).toMatchObject([
				{ id: 'tid-3', sort: -1000 },
				{ id: 'tid-1', sort: 0 },
				{ id: 'tid-2', sort: 1000 }
			]);
		});
	});

	describe('shift down by two', () => {
		it('calculates scores correctly when moving first position to last', async () => {
			const task1: ITask = makeTask({ id: 'tid-1', sort: 0, name: '1' });
			const task2: ITask = makeTask({ id: 'tid-2', sort: 1000, name: '2' });
			const task3: ITask = makeTask({ id: 'tid-3', sort: 2000, name: '3' });
			const tasks: ITask[] = [task1, task2, task3];
			const state = new TasksState({ db, tasks });
			const newTasks = [task2, task3, task1];

			await state.moveTask('tid-1', newTasks);

			expect(state.filteredTasks).toMatchObject([
				{ id: 'tid-2' },
				{ id: 'tid-3' },
				{ id: 'tid-1', sort: 3000 }
			]);
		});
	});
});
