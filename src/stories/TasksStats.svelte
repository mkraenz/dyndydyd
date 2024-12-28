<script lang="ts">
	import { getTasksContext } from '$lib/state/TasksState.svelte';

	const tasksState = getTasksContext();
	let totalDone = $derived(tasksState.filteredTasks.filter((t) => t.done).length);
	let hiddenTasks = $derived(tasksState.allTasks.length - tasksState.filteredTasks.length);
</script>

<p>
	{totalDone} / {tasksState.filteredTasks.length} Tasks completed.
	{#if hiddenTasks}{hiddenTasks} hidden.{/if}
</p>
