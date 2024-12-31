<script>
	import { Tween } from 'svelte/motion';
	import { cubicInOut as cubic } from 'svelte/easing';
	let progressTop = new Tween(0, { duration: 2000, easing: cubic });
	let progressLeft = new Tween(0, { duration: 2000 });
</script>

<progress
	value={progressTop.current}
	style={`position: absolute; top: calc( 300 * ${progressTop.current}px );`}
></progress>

<p
	class="flying"
	style={`--progress: ${progressTop.current}; --progress-left: ${progressLeft.current}`}
>
	I am flyyyyying
</p>

<h2>Vertical</h2>
<div class="group">
	<button onclick={() => (progressTop.target = 0)}>0%</button>
	<button onclick={() => (progressTop.target = 0.25)}>25%</button>
	<button onclick={() => (progressTop.target = 0.5)}>50%</button>
	<button onclick={() => (progressTop.target = 0.75)}>75%</button>
	<button onclick={() => (progressTop.target = 1)}>100%</button>
</div>
<h2>Horizontal</h2>
<div class="group">
	<button onclick={() => (progressLeft.target = 0)}>0%</button>
	<button onclick={() => (progressLeft.target = 0.25)}>25%</button>
	<button onclick={() => (progressLeft.target = 0.5)}>50%</button>
	<button onclick={() => (progressLeft.target = 0.75)}>75%</button>
	<button onclick={() => (progressLeft.target = 1)}>100%</button>
</div>

<style>
	:root {
		padding: 1rem;
	}
	progress {
		display: block;
		width: 100%;
	}
	.group {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
	}
	.flying {
		position: absolute;
		top: calc(95vh * var(--progress));
		left: calc(95vw * var(--progress-left));
		color: white;
		background-color: red;
		z-index: 1000;
	}
</style>
