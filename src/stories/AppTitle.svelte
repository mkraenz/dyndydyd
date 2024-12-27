<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { languageTag, availableLanguageTags } from '$lib/paraglide/runtime.js';

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

<div class="container">
	<h1>{m.title()}</h1>
	<!-- <button onclick={() => switchToLanguage('de')}>en</button>
	<button onclick={() => switchToLanguage('en')}>de</button> -->
	<button class="outline" onclick={nextLanguage}>{emoji[languageTag()]}</button>
</div>

<style>
	.container {
		display: flex;
		justify-content: space-between;
	}
</style>
