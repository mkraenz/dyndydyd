<script lang="ts">
	import { type Filter, type ITask } from '$lib/types';
	import AppTitle from '../stories/AppTitle.svelte';
	import FilterButtons from '../stories/FilterButtons.svelte';
	import TaskForm from '../stories/TaskForm.svelte';
	import TaskList from '../stories/TaskList.svelte';
	import * as m from '$lib/paraglide/messages';

	let tasks = $state<ITask[]>([]);
	let filter = $state<Filter>('all');
	const addTask = (task: ITask) => tasks.push(task);
	const toggleDone = (task: ITask) => (task.done = !task.done);
	const removeTask = (id: string) => (tasks = tasks.filter((t) => t.id !== id));
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
	<TaskList tasks={filteredTasks} {toggleDone} {removeTask} />
</main>

<style>
	.main {
		margin: 0 auto;
		max-width: 800px;
		padding: 1rem;
	}
</style>
