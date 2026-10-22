import { defineParams } from '@sveltejs/kit/params';
import { isSectionParam } from '../lib/content/paths.ts';

export const params = defineParams({
	// Only URLs that name a section match; anything else is a 404
	section: (param) => (isSectionParam(param) ? param : undefined)
});
