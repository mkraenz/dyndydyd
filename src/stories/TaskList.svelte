<script lang="ts">
	import { getTasksContext } from '$lib/state/TasksState.svelte';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages';
	import { dndzone, type DndEvent } from 'svelte-dnd-action';
	import type { ITask } from '$lib/models/types';
	import DragIndicator from 'virtual:icons/mdi/drag';

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
	function handleDndConsider(e: CustomEvent<DndEvent<ITask>>) {
		tasksState.dragging = true;
		if (tasksState.doneAtBottom) tasksState.allTasks = [...e.detail.items, ...tasksState.doneTasks];
		else tasksState.allTasks = e.detail.items;
	}
	function handleDndFinalize(e: CustomEvent<DndEvent<ITask>>) {
		tasksState.dragging = false;
		const movedId = e.detail.info.id;
		tasksState.moveTask(movedId, e.detail.items);
	}
</script>

<ul
	use:dndzone={{ items: tasksState.filteredTasks, dropTargetStyle: {} }}
	onconsider={handleDndConsider}
	onfinalize={handleDndFinalize}
>
	{#each tasksState.filteredTasks as task (task.id)}
		<li
			animate:flip={{ duration: 200 }}
			onmouseenter={() => setHoveringOver(task.id, true)}
			onmouseleave={() => setHoveringOver(task.id, false)}
			onfocusin={() => setFocusingOver(task.id, true)}
			onfocusout={() => setFocusingOver(task.id, false)}
		>
			<article>
				<div
					class="drag-icon-container"
					class:hidden={!idToHoverState[task.id]?.focus && !idToHoverState[task.id]?.hover}
				>
					<DragIndicator width="2rem" height="2rem" />
				</div>
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

{#if tasksState.doneAtBottom}
	<div transition:slide>
		<p>{m.completed_items({ totalDoneCount: tasksState.totalTasksDone })}</p>
		<ul>
			{#each tasksState.doneTasks as task (task.id)}
				<li
					animate:flip={{ duration: 200 }}
					onmouseenter={() => setHoveringOver(task.id, true)}
					onmouseleave={() => setHoveringOver(task.id, false)}
					onfocusin={() => setFocusingOver(task.id, true)}
					onfocusout={() => setFocusingOver(task.id, false)}
				>
					<article>
						<div class="drag-icon-container hidden">
							<DragIndicator width="2rem" height="2rem" />
						</div>
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
	</div>
{/if}

<style>
	ul {
		padding-left: 0px;
		gap: 0.5rem;
		display: flex;
		flex-direction: column;
	}
	article {
		align-items: center;
		text-align: center;
		margin-bottom: 0;
		padding-left: 8px;
		padding-right: 8px;
		padding-top: 0;
		padding-bottom: 0;
		display: grid;
		grid-template-columns: min-content min-content 1fr min-content;
		grid-template-rows: 1fr;
		grid-column-gap: 0px;
		grid-row-gap: 0.25rem;
	}
	li {
		list-style-type: none;
		margin-bottom: 0;
	}
	.drag-icon-container {
		margin-right: 0.25rem;
	}
	.done {
		text-decoration: line-through;
		color: var(--pico-muted-color);
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
		border-color: var(--pico-muted-color);
	}
	.hidden {
		opacity: 0; /* using opacity over display:none or visibility: hidden to ensure the element can receive focus properly*/
	}
</style>
