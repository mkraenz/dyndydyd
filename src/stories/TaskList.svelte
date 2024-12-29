<script lang="ts">
	import { getTasksContext } from '$lib/state/TasksState.svelte';
	import { slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages';

	const tasksState = getTasksContext();

	let idToHoverState = $state<{
		[taskId: string]: { hover?: boolean; focus?: boolean } | undefined;
	}>({});

	function setHoveringOver(id: string, hovering: boolean) {
		idToHoverState[id] ??= {};
		idToHoverState[id].hover = hovering;
	}
	function setFocusingOver(id: string, focusing: boolean) {
		idToHoverState[id] ??= {};
		idToHoverState[id].focus = focusing;
	}
</script>

<ul>
	{#each tasksState.filteredTasks as task (task.id)}
		<li
			transition:slide
			onmouseenter={() => setHoveringOver(task.id, true)}
			onmouseleave={() => setHoveringOver(task.id, false)}
			onfocusin={() => setFocusingOver(task.id, true)}
			onfocusout={() => setFocusingOver(task.id, false)}
		>
			<article>
				<div class="left-container">
					<input
						type="checkbox"
						class="checkbox"
						checked={task.done}
						onchange={() => tasksState.toggleDone(task)}
					/>
					<!-- not using onchange listener but oninput because onchange does not capture del and backspace -->
					<input
						type="text"
						class="textinput"
						class:done={task.done}
						value={task.name}
						oninput={(e) => tasksState.setTaskName(task, e.currentTarget.value)}
					/>
				</div>
				<button
					aria-label={m.remove_task()}
					class="remove-button"
					class:hidden={!idToHoverState[task.id]?.focus && !idToHoverState[task.id]?.hover}
					onclick={() => tasksState.removeTask(task.id)}>X</button
				>
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
		padding-top: 0;
		padding-bottom: 0;
	}
	li {
		list-style-type: none;
		margin-bottom: 0;
	}
	.done {
		text-decoration: line-through;
		color: var(--pico-muted-color);
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
	.remove-button {
		border-color: transparent;
		background-color: transparent;
		color: var(--pico-muted-color);
	}
	.remove-button:hover,
	.remove-button:focus {
		background-color: rgb(from white r g b / var(--dimmed-alpha));
	}
	.checkbox {
		background-color: rgb(from white r g b / var(--dimmed-alpha));
	}
	.checkbox:checked {
		background-image: var(--dimmed-icon-checkbox);
		/* border-color: var(--pico-muted-color); */
	}
	.hidden {
		opacity: 0; /* using opacity over display:none or visibility: hidden to ensure the element can receive focus properly*/
	}
</style>
