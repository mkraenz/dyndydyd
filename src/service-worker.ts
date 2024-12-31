/// <reference types="@sveltejs/kit" />
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="webworker" />
import { build, files, version } from '$service-worker';

// following svelte docs on service workers https://svelte.dev/docs/kit/service-workers and https://www.youtube.com/watch?v=_wiOcdEVgks

declare let self: ServiceWorkerGlobalScope;

console.log('service worker', { version });
const CACHE = `dyn-${version}`;
const assets = getAssets();
main();

function main() {
	self.addEventListener('install', (event) => {
		event.waitUntil(cacheFiles());
	});

	self.addEventListener('activate', (event) => {
		event.waitUntil(deleteOutdatedCaches());
	});

	self.addEventListener('fetch', (event) => {
		const shouldIntercept = event.request.method === 'GET';
		if (!shouldIntercept) return;
		event.respondWith(interceptedGETResponse(event));
	});

	self.addEventListener('message', async (event) => {
		if (event.data?.type === 'SERVICE_WORKER_SKIP_WAITING') await self.skipWaiting();
	});
}

function getAssets() {
	return [
		...build, // the app itself. in dev mode, this is empty. You have to `pnpm run build && run pnpm run preview` to see how it looks like in production.
		...files // files in static directory
	];
}

async function interceptedGETResponse(event: FetchEvent) {
	const url = new URL(event.request.url);
	const cache = await openCache();

	// a request to some build asset is save to serve because files are build-version specific, e.g. i18n.BsF1YYZb.js
	// a request to static files is theoretically also save, except when some static file gets replaced without changing the name. So theoretically a max cache time would be nice to revalidate using stale-while-validating
	const requestedAsset = assets.includes(url.pathname);
	if (requestedAsset) {
		const cachedResponse = await cache.match(url.pathname);
		if (cachedResponse) return cachedResponse;
	}

	try {
		const response = await fetch(event.request);

		// according to svelte service worker docs: when offline, fetch can return a value that is not a Response
		// instead of throwing - and we can't pass this non-Response to respondWith
		if (!(response instanceof Response)) throw new Error('invalid response from fetch');

		// cache for offline access
		if (response.status === 200) await cache.put(event.request, response.clone());

		return response;
	} catch (error) {
		// fetch didn't work. try to serve cache
		const response = await cache.match(event.request);
		if (response) return response;
		throw error;
	}
}

function openCache() {
	return caches.open(CACHE);
}

async function cacheFiles() {
	const cache = await openCache();
	await cache.addAll(assets);
}

/** with each service worker version, we create a new cache under a new name. The old caches should be cleaned up to not use up storage of the user unnecessarily. */
async function deleteOutdatedCaches() {
	const keys = await caches.keys();
	const deletionPromises = keys.map((key) => {
		if (key !== CACHE) return caches.delete(key);
		return null;
	});
	await Promise.all(deletionPromises);
}
