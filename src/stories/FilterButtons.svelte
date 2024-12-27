<script lang="ts">
	import type { Filter } from '$lib/types';

	type Props = {
		setFilter: (filter: Filter) => void;
		currentFilter: Filter;
	};
	let { setFilter, currentFilter }: Props = $props();
</script>

<div class="filter-container">
	<button
		class="secondary"
		class:contrast={currentFilter === 'all'}
		onclick={() => setFilter('all')}>All</button
	>
	<button
		class="secondary"
		class:contrast={currentFilter === 'todo'}
		onclick={() => setFilter('todo')}>Todo</button
	>
	<button
		class="secondary"
		class:contrast={currentFilter === 'done'}
		onclick={() => setFilter('done')}>Done</button
	>
</div>

<style>
	.filter-container {
		display: flex;
		gap: 0.5rem;
		justify-content: end;
		margin-bottom: 1rem;
	}
</style>
