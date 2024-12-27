<script lang="ts">
	import type { ITask } from '$lib/types';

	type Props = {
		task: ITask;
		toggleDone: (task: ITask) => void;
		removeTask: (id: string) => void;
	};
	let { task, toggleDone, removeTask }: Props = $props();
</script>

<li>
	<article>
		<label>
			<input type="checkbox" checked={task.done} onchange={() => toggleDone(task)} />
			<span class:done={task.done}>{task.name}</span>
		</label>
		<button class="outline" onclick={() => removeTask(task.id)}>Remove</button>
	</article>
</li>

<style>
	article {
		display: flex;
		align-items: center;
		/* text-align: center; */
		justify-content: space-between;
	}
	li {
		display: contents;
	}
	.done {
		text-decoration: line-through;
	}
</style>
