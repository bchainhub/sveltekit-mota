import type { LayoutServerLoad } from './$types';
import { redirect, error } from '@sveltejs/kit';
import { getAvailableLocales } from '$lib/helpers/i18n';

const languageConfig = __SITE_CONFIG__?.language;
const available = getAvailableLocales();
const defaultLocale = languageConfig?.defaultLocale || 'en';

export const load: LayoutServerLoad = async ({ url, params, request, locals }) => {
	if (!languageConfig?.enabled) {
		locals.locale = defaultLocale;
		return { locale: defaultLocale };
	}

	// 1) derive candidate locale from URL params
	let locale = params.lang ?? defaultLocale;

	// 2) if a locale is in the URL but it's the default, strip it
	if (params.lang && params.lang === defaultLocale) {
		const without = url.pathname.replace(`/${defaultLocale}`, '') || '/';
		throw redirect(302, `${without}${url.search}`);
	}

	// 3) final checks
	if (!available.includes(locale)) {
		// You could also redirect to default here
		throw error(404, 'Locale not supported');
	}

	locals.locale = locale;

	// return the locale and a flag indicating if it came from URL
	return {
		locale,
		fromUrl: !!params.lang
	};
};
