<script lang="ts">
	import AppTitle from '../stories/AppTitle.svelte';
	import FilterButtons from '../stories/FilterButtons.svelte';
	import TaskForm from '../stories/TaskForm.svelte';
	import TaskList from '../stories/TaskList.svelte';
	import * as m from '$lib/paraglide/messages';
	import db from '$lib/db';
	import type { PageData } from './$types';
	import { getTasksContext, setTasksContext } from '$lib/state/TasksState.svelte';
	import TasksStats from '../stories/TasksStats.svelte';
	import MoreTasksListActions from '../stories/MoreTasksListActions.svelte';

	let { data }: { data: PageData } = $props();

	setTasksContext({ db, tasks: data.tasks });
	const tasksState = getTasksContext();
</script>

<main class="main">
	<AppTitle />
	<TaskForm />
	{#if tasksState.allTasks.length}
		<!-- <TasksStats />
		<FilterButtons /> -->
		<MoreTasksListActions />
	{:else}
		<p>{m.get_started()}</p>
	{/if}
	<TaskList />
</main>

<style>
	.main {
		margin: 0 auto;
		max-width: 800px;
		padding: 1rem;
	}
</style>
