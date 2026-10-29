import { defineParams } from '@sveltejs/kit/params';
import { isSectionParam } from '../lib/content/paths.ts';

export const params = defineParams({
	section: (param) => (isSectionParam(param) ? param : undefined)
});
