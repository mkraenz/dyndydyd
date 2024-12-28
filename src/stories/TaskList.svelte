<script lang="ts">
	import { getTasksContext } from '$lib/state/TasksState.svelte';
	import { slide } from 'svelte/transition';

	const tasksState = getTasksContext();
</script>

<ul>
	{#each tasksState.filteredTasks as task (task.id)}
		<li transition:slide>
			<article>
				<div class="left-container">
					<input type="checkbox" checked={task.done} onchange={() => tasksState.toggleDone(task)} />
					<!-- not using onchange listener but oninput because onchange does not capture del and backspace -->
					<input
						type="text"
						class="textinput"
						class:done={task.done}
						value={task.name}
						oninput={(e) => tasksState.setTaskName(task, e.currentTarget.value)}
					/>
				</div>
				<button class="outline" onclick={() => tasksState.removeTask(task.id)}>X</button>
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
		margin-bottom: 0;
	}
	li {
		list-style-type: none;
	}
	.done {
		text-decoration: line-through;
	}
	.left-container {
		display: flex;
		align-items: center;
		margin-bottom: 0;
	}
	.textinput {
		margin-bottom: 0;
		background-color: var(--pico-card-background-color);
		border: 0;
	}
</style>
