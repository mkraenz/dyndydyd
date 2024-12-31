import { browser } from '$app/environment';
import db from '$lib/db';
import type { PageLoad } from './$types';

// export const ssr = true; // true is the default in sveltekit

export const load: PageLoad = async ({}) => {
	if (browser) {
		const allTasks = await db.tasks.findAll({});
		return {
			tasks: allTasks
		};
	}

	return { tasks: [] };
};
