<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import type { Snippet } from 'svelte';
	import './global.css';
	// import { pwaInfo } from 'virtual:pwa-info';

	// let webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();
</script>

<!-- <svelte:head>
	{@html webManifestLink}
</svelte:head> -->

<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
