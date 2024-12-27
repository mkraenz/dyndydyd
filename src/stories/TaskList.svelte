<script lang="ts">
	import type { ITask } from '$lib/types';
	import TaskListItem from './TaskListItem.svelte';

	type Props = {
		tasks: ITask[];
		toggleDone: (task: ITask) => void;
		removeTask: (id: string) => void;
	};
	let { tasks, toggleDone, removeTask }: Props = $props();
</script>

<ul>
	{#each tasks as task (task.id)}
		<TaskListItem {task} {toggleDone} {removeTask} />
	{/each}
</ul>

<style>
	ul {
		padding-left: 0px;
		gap: 0.5rem;
		display: flex;
		flex-direction: column;
	}
</style>
