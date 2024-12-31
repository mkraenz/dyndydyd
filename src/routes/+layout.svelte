<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import { onMount, type Snippet } from 'svelte';
	import './global.css';
	import { detectServiceWorkerUpdate } from '$lib/pwa';
	import * as m from '$lib/paraglide/messages';
	// import { pwaInfo } from 'virtual:pwa-info';

	// let webManifestLink = pwaInfo ? pwaInfo.webManifest.linkTag : '';
	type Props = {
		children: Snippet;
	};
	let { children }: Props = $props();

	onMount(detectServiceWorkerUpdate);
</script>

<svelte:head>
	<title>{m.home_title()}</title>
	<!-- {@html webManifestLink} -->
</svelte:head>

<ParaglideJS {i18n}>
	{@render children()}
</ParaglideJS>
