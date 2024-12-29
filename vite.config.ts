import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import Icons from 'unplugin-icons/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		sveltekit(),
		paraglide({
			project: './configs/project.inlang',
			outdir: './src/lib/paraglide'
		}),
		Icons({
			compiler: 'svelte'
		})
	],

	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
