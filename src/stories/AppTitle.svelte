<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { languageTag, availableLanguageTags } from '$lib/paraglide/runtime.js';
	import CloudOff from 'virtual:icons/mdi/cloud-off';
	// import CloudDone from 'virtual:icons/mdi/cloud-done';
	import { browser } from '$app/environment';

	let online = $state(false);

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath);
	}
	function nextLanguage() {
		const index = availableLanguageTags.indexOf(languageTag());
		const nextLang = availableLanguageTags[(index + 1) % availableLanguageTags.length];
		switchToLanguage(nextLang);
	}

	const emoji: { [key in AvailableLanguageTag]: string } = {
		en: '🇬🇧',
		de: '🇩🇪'
	};
</script>

<svelte:window bind:online />

<div class="container">
	<h1>{m.title()}</h1>
	<div class="button-container">
		{#if browser && !online}
			<!-- don't include icon in SSR since it will otherwise always be rendered and cause the UI to glitch on load in the client -->
			<CloudOff width="2rem" height="2rem" />
		{:else}
			<!-- <CloudDone width="2rem" height="2rem" /> -->
		{/if}
		<button class="outline secondary" onclick={nextLanguage}>{emoji[languageTag()]}</button>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: space-between;
	}
	.button-container {
		display: flex;
		align-items: center;
		gap: 1rem;
		justify-content: flex-end;
	}
</style>
