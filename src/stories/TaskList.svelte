<script lang="ts">
	import type { ITask } from '$lib/types';
	import { fade } from 'svelte/transition';

	type Props = {
		tasks: ITask[];
		toggleDone: (task: ITask) => void;
		removeTask: (id: string) => void;
	};
	let { tasks, toggleDone, removeTask }: Props = $props();
</script>

<ul>
	{#each tasks as task (task.id)}
		<li transition:fade>
			<article>
				<label>
					<input type="checkbox" checked={task.done} onchange={() => toggleDone(task)} />
					<span class:done={task.done}>{task.name}</span>
				</label>
				<button class="outline" onclick={() => removeTask(task.id)}>Remove</button>
			</article>
		</li>
	{/each}
</ul>

<style>
	ul {
		padding-left: 0px;
		gap: 0.5rem;
		display: flex;
		flex-direction: column;
	}
	article {
		display: flex;
		align-items: center;
		/* text-align: center; */
		justify-content: space-between;
	}
	li {
		list-style-type: none;
	}
	.done {
		text-decoration: line-through;
	}
</style>
