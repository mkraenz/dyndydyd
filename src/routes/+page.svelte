<script lang="ts">
	import { type Filter, type ITask } from '$lib/models/types';
	import AppTitle from '../stories/AppTitle.svelte';
	import FilterButtons from '../stories/FilterButtons.svelte';
	import TaskForm from '../stories/TaskForm.svelte';
	import TaskList from '../stories/TaskList.svelte';
	import * as m from '$lib/paraglide/messages';
	import db from '$lib/db';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	let tasks = $state<ITask[]>(data.tasks);
	let filter = $state<Filter>('all');
	const addTask = async (task: ITask) => {
		tasks.push(task);
		await db.tasks.create(task.toJSON()); // using .toJSON since dexie doesn't like getter props which are used heavily with svelte runes. This dexie behavior seems to be inherited from indexedDb https://stackoverflow.com/a/65135601
	};
	const toggleDone = (task: ITask) => task.complete();
	const removeTask = async (id: string) => {
		tasks = tasks.filter((t) => t.id !== id);
		await db.tasks.remove(id);
	};
	const setTaskName = async (task: ITask, name: string) => {
		task.name = name;
		await db.tasks.update(task.id, { name });
	};
	let filteredTasks = $derived.by(() => {
		switch (filter) {
			case 'done':
				return tasks.filter((t) => t.done);
			case 'todo':
				return tasks.filter((t) => !t.done);
			case 'all':
			default:
				return tasks;
		}
	});
	let totalDone = $derived(filteredTasks.filter((t) => t.done).length);
	let hiddenTasks = $derived(tasks.length - filteredTasks.length);
</script>

<main class="main">
	<AppTitle />
	<TaskForm {addTask} />
	{#if tasks.length}
		<p>
			{totalDone} / {filteredTasks.length} Tasks completed.
			{#if hiddenTasks}{hiddenTasks} hidden.{/if}
		</p>
		<FilterButtons setFilter={(next) => (filter = next)} currentFilter={filter} />
	{:else}
		<p>{m.get_started()}</p>
	{/if}
	<TaskList tasks={filteredTasks} {toggleDone} {removeTask} {setTaskName} />
</main>

<style>
	.main {
		margin: 0 auto;
		max-width: 800px;
		padding: 1rem;
	}
</style>
