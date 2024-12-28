import db from '$lib/db';
import type { PageLoad } from './$types';

export const ssr = false;

export const load: PageLoad = async ({}) => {
	const allTasks = await db.tasks.findAll({});
	return {
		tasks: allTasks
	};
};
