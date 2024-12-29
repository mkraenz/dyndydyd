<script lang="ts">
	import { getTasksContext } from '$lib/state/TasksState.svelte';
	import * as m from '$lib/paraglide/messages';
	import { slide } from 'svelte/transition';

	const tasksState = getTasksContext();
	let totalDoneCount = $derived(tasksState.filteredTasks.filter((t) => t.done).length);
	let hiddenCount = $derived(tasksState.allTasks.length - tasksState.filteredTasks.length);
</script>

<p transition:slide>
	{m.task_stats({ totalDoneCount, visibleTasksCount: tasksState.filteredTasks.length })}
	{#if hiddenCount}
		{m.task_stats_hidden({ hiddenCount })}
	{/if}
</p>
