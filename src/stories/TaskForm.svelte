<script lang="ts">
	import { Task } from '$lib/models/Task.svelte';
	import * as m from '$lib/paraglide/messages';
	import { getTasksContext } from '$lib/state/TasksState.svelte';
	import { isAlphanumeric } from '$lib/utils/is-alphanumeric';

	const tasksState = getTasksContext();
	let name = $state('');
	let inputRef = $state<HTMLInputElement>();

	const onsubmit = async (e: SubmitEvent) => {
		avoidLosingInputFocus(e);
		if (!name) return;
		// learning: svelte5 doesn't really support class instances. We're making it work by renaming the file to `.svelte.ts` and using `$state()` - which unfortunately binds the model to svelte but at least its reactive now. The svelte parts are also very minimal so should be fine.
		const newTask = Task.from({ name });
		tasksState.addTask(newTask);
		name = '';

		function avoidLosingInputFocus(e: SubmitEvent) {
			e.preventDefault();
		}
	};

	$effect(() => {
		function listener(e: KeyboardEvent) {
			const inputDoesNotHaveFocus = document.activeElement !== inputRef;
			if (isAlphanumeric(e.key) && inputDoesNotHaveFocus) {
				// e.preventDefault(); // this would prevent the key from being written to the input on first keystroke, but ever since the change to just hit any alphanumeric key to focus, it feels more natural to just type and have it accepted by the input immediately.
				inputRef?.focus();
			}
		}
		window.addEventListener('keypress', listener);
		return () => window.removeEventListener('keypress', listener);
	});
</script>

<form {onsubmit}>
	<label>
		{m.task()}
		<input name="newTask" bind:value={name} bind:this={inputRef} />
	</label>
	<div class="button-container">
		<button>{m.add()}</button>
	</div>
</form>

<style>
	.button-container {
		display: flex;
		justify-content: end;
	}
	button {
		width: 180px;
	}
	form {
		margin-bottom: 1rem;
	}
</style>
