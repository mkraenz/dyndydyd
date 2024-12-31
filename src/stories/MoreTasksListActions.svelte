<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { getTasksContext } from '$lib/state/TasksState.svelte';
	import { slide } from 'svelte/transition';
	import ExportTasks from './ExportTasks.svelte';

	const tasksState = getTasksContext();
</script>

<div class="secondaryButtonsContainer" transition:slide>
	<button onclick={() => tasksState.toggleDoneAtBottom()} class="secondary"
		>{m.shift_done_tasks()}</button
	>
	<ExportTasks />
</div>

<style>
	.secondaryButtonsContainer {
		display: flex;
		justify-content: end;
		margin-bottom: 0.5rem;
		gap: 1rem;
	}
</style>
