<script lang="ts">
	import AppTitle from '../stories/AppTitle.svelte';
	import TaskForm from '../stories/TaskForm.svelte';
	import TaskList from '../stories/TaskList.svelte';
	import * as m from '$lib/paraglide/messages';
	import db from '$lib/db';
	import type { PageData } from './$types';
	import { getTasksContext, setTasksContext } from '$lib/state/TasksState.svelte';
	import MoreTasksListActions from '../stories/MoreTasksListActions.svelte';

	let { data }: { data: PageData } = $props();

	setTasksContext({ db, tasks: data.tasks });
	const tasksState = getTasksContext();
</script>

<svelte:head>
	<title>{m.home_title()}</title>
	<meta name="description" content={m.page_head_description()} />
</svelte:head>

<main class="main">
	<AppTitle />
	<TaskForm />
	{#if tasksState.allTasks.length}
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

	@media (display-mode: browser) {
		/* TODO #1 PWA installation invitation https://web.dev/learn/pwa/installation */
	}
</style>
