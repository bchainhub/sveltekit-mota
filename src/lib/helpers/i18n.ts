import { browser } from '$app/environment';

const config = (typeof __SITE_CONFIG__ !== 'undefined' ? __SITE_CONFIG__ : {})?.language;

// -----------------------------
// Locale types
// -----------------------------

export type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends (...args: any) => any
		? T[K] // keep function signatures intact
		: T[K] extends object
			? DeepPartial<T[K]>
			: T[K];
};

// -----------------------------
// Deep merge helpers (exported)
// -----------------------------

/**
 * Deep-merge dictionaries: overlay overrides base; objects are merged; functions/strings overwrite.
 * Use for building a full locale dictionary from a DeepPartial overlay.
 */
export function deepMergeDict<T>(base: T, overlay: DeepPartial<T> | undefined): T {
	if (!overlay) return base;
	const out: any = Array.isArray(base) ? [] : { ...base };
	for (const key of Object.keys(overlay as any)) {
		const bv = (base as any)[key];
		const ov = (overlay as any)[key];
		if (
			bv &&
			ov &&
			typeof bv === 'object' &&
			typeof ov === 'object' &&
			!Array.isArray(bv) &&
			!Array.isArray(ov)
		) {
			out[key] = deepMergeDict(bv, ov);
		} else {
			out[key] = ov;
		}
	}
	return out as T;
}

// -----------------------------
// Locale utilities
// -----------------------------

// get available locales from config
export const getAvailableLocales = (): string[] => {
	if (!config?.enabled) return ['en'];
	const locales = config?.availableLocales;
	return locales ? locales.map(locale => locale.code) : ['en'];
};

// get available locales with names from config
export const getAvailableLocalesWithNames = (): Array<{ code: string; name: string }> => {
	if (!config?.enabled) {
		return [{ code: 'en', name: 'English' }];
	}
	const locales = config?.availableLocales;
	if (!locales) {
		return [{ code: 'en', name: 'English' }];
	}

	return locales.map(locale => ({
		code: locale.code,
		name: locale.name || locale.code.toUpperCase()
	}));
};

// get the current locale
export const getLocale = (): string => {
	if (!config?.enabled) return 'en';
	if (browser) {
		return localStorage.getItem('locale') || config?.defaultLocale || 'en';
	}
	return config?.defaultLocale || 'en';
};

// set the active locale for $LL (and persist in localStorage on browser)
// - Ensures base + active dictionaries are loaded on the client before switching
export const applyLocale = async (locale: string) => {
	if (!config?.enabled) return;

	if (browser) {
		// Unconditionally load base + active on the client.
		// The sync loader is idempotent, so repeated calls are fine.
		const { loadLocaleAsync } = await import('../../i18n/i18n-util.async');
		await loadLocaleAsync(locale as any);
		localStorage.setItem('locale', locale);
	}

	const { setLocale: i18nSetLocale } = await import('../../i18n/i18n-svelte');
	i18nSetLocale(locale as any);
};

// preload a locale dictionary into memory (used by layout load)
export const loadLocaleAsync = async (locale: string) => {
	if (!config?.enabled) return;
	const { loadLocaleAsync } = await import('../../i18n/i18n-util.async');
	await loadLocaleAsync(locale as any);
};

// Layout load function for i18n
// - Preloads the active locale dictionary and the default (base) locale
// - Returns { locale } so +layout.svelte can apply it
export const createI18nLayoutLoad = () => {
	return async ({ params }: any) => {
		const locale = (params?.lang as any) || config?.defaultLocale || 'en';

		await loadLocaleAsync(locale);

		return { locale };
	};
};

// -----------------------------
// Simple translation helper: t(key, LL, vars?)
// -----------------------------

export type Vars = Record<string, string | number | boolean | null | undefined>;

/**
 * Resolve a dotted i18n key against $LL and (optionally) pass vars.
 * - If the resolved value is a function -> calls it with vars.
 * - If it's a string -> returns it (with optional {vars} interpolation).
 * - If not found -> returns the key as a fallback.
 */
export function t(key: string, LL: Record<string, any>, vars?: Vars): string {
	// navigate dotted path: 'footer.links.about' -> LL.footer.links.about
	let cur: any = LL;
	for (const part of key.split('.')) {
		if (cur && part in cur) cur = cur[part];
		else return key; // fallback: show the key when missing
	}

	// function-valued messages (normal in typesafe-i18n)
	if (typeof cur === 'function') {
		return cur(vars);
	}

	// plain string messages (less common, but supported)
	if (typeof cur === 'string') {
		if (vars) {
			let out = cur;
			for (const [k, v] of Object.entries(vars)) {
				out = out.replace(new RegExp(`\\{${k}\\}`, 'g'), v == null ? '' : String(v));
			}
			return out;
		}
		return cur;
	}

	// anything unexpected -> key fallback
	return key;
}
