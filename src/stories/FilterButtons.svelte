<script lang="ts">
	import type { Filter } from '$lib/types';
	import { fade } from 'svelte/transition';

	type Props = {
		setFilter: (filter: Filter) => void;
		currentFilter: Filter;
	};
	let { setFilter, currentFilter }: Props = $props();
</script>

<div class="filter-container" transition:fade>
	{@render filterButton('all')}
	{@render filterButton('todo')}
	{@render filterButton('done')}
</div>

{#snippet filterButton(type: Filter)}
	<button class="secondary" class:contrast={currentFilter === type} onclick={() => setFilter(type)}
		>{type}</button
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
