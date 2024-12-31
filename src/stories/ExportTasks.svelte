<script lang="ts">
	import * as m from '$lib/paraglide/messages';
	import { getTasksContext } from '$lib/state/TasksState.svelte';

	let loading = $state(false);
	const tasksState = getTasksContext();
	const exportTasks = async () => {
		try {
			loading = true;
			await tasksState.loadAllTasks();
			const data = JSON.stringify({ tasks: tasksState.allTasks }, null, 2);
			const blob = new Blob([data], { type: 'application/json' });
			const url = URL.createObjectURL(blob);
			const anchor = document.createElement('a');
			anchor.href = url;
			const now = new Date().getTime();
			anchor.download = `dyndydyd-${now}.json`;
			document.body.appendChild(anchor);
			anchor.click();
			document.body.removeChild(anchor);
			URL.revokeObjectURL(url);
		} catch (error) {
			console.error(error);
			alert(m.errors_oops());
		} finally {
			loading = false;
		}
	};
</script>

<button onclick={exportTasks} disabled={loading} class="secondary"
	>{loading ? m.export_please_wait() : m.export_tasks()}</button
>

<style>
	button {
		width: var(--min-button-width);
	}
</style>
