import { getAvailableLocales } from '$lib/helpers/i18n';

export function match(param: string) {
	return getAvailableLocales().includes(param);
}
