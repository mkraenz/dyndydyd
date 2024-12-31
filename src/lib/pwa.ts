import * as m from '$lib/paraglide/messages';

export async function detectServiceWorkerUpdate() {
	const registration = await navigator.serviceWorker.getRegistration();
	registration?.addEventListener('updatefound', () => {
		const newServiceWorker = registration.installing;
		newServiceWorker?.addEventListener('statechange', (e) => {
			if (newServiceWorker.state === 'installed') {
				// remember: confirm is like alert and blocking the code execution!
				const confirmed = confirm(m.service_worker_update_available());
				if (confirmed) {
					newServiceWorker.postMessage({ type: 'SERVICE_WORKER_SKIP_WAITING' });
				}
			}
		});
	});
}
