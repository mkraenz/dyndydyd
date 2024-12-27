<script lang="ts">
	import { Task } from '$lib/models/Task';
	import type { ITask } from '$lib/types';

	type Props = {
		addTask: (task: ITask) => void;
	};
	let { addTask }: Props = $props();
	let name = $state('');

	const onsubmit = (e: SubmitEvent) => {
		avoidLosingInputFocus(e);
		if (!name) return;
		// learning: svelte doesn't like class instances. some level of reactivity (e.g. the count of done tasks) gets lost without toJSON().
		addTask(new Task({ name }).toJSON());
		name = '';

		function avoidLosingInputFocus(e: SubmitEvent) {
			e.preventDefault();
		}
	};
</script>

<form {onsubmit}>
	<label>
		Task
		<input name="newTask" bind:value={name} />
	</label>
	<div class="button-container">
		<button>Add</button>
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
