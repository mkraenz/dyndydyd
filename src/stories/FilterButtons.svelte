<script lang="ts">
	import type { Filter } from '$lib/models/types';
	import { getTasksContext } from '$lib/state/TasksState.svelte';
	import { slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages';

	const tasksState = getTasksContext();
</script>

<div class="filter-container" transition:slide>
	{@render filterButton('all')}
	{@render filterButton('todo')}
	{@render filterButton('done')}
</div>

{#snippet filterButton(type: Filter)}
	<button
		class="secondary"
		class:contrast={tasksState.filter === type}
		onclick={() => (tasksState.filter = type)}>{m[`filters_${type}`]()}</button
	>
{/snippet}

<style>
	.filter-container {
		display: flex;
		gap: 0.5rem;
		justify-content: end;
		margin-bottom: 1rem;
	}
	button {
		text-transform: capitalize;
	}
</style>
