<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { getTasksContext } from '$lib/state/TasksState.svelte';

	const tasksState = getTasksContext();
</script>

<div class="secondaryButtonsContainer">
	<button onclick={() => tasksState.toggleDoneAtBottom()} class="secondary"
		>{m.shift_done_tasks()}</button
	>
</div>

<style>
	.secondaryButtonsContainer {
		display: flex;
		justify-content: end;
		margin-bottom: 0.5rem;
	}
</style>
