import { paraglide } from '@inlang/paraglide-sveltekit/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { SvelteKitPWA } from '@vite-pwa/sveltekit';
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
		}),
		SvelteKitPWA({
			registerType: 'autoUpdate',
			manifest: {
				theme_color: '#181c25',
				background_color: '#13171f',
				icons: [
					{
						src: './icons/android-chrome-192x192.png',
						sizes: '192x192',
						type: 'image/png',
						purpose: 'any'
					},
					{
						src: '/icons/android-chrome-512x512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any'
					}
				],
				scope: '/'
			}
		})
	],

	resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}']
	}
});
