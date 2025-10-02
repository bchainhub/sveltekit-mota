// This is a stub file for optional typesafe-i18n support
// When typesafe-i18n is properly set up, this file will be replaced
// with the generated i18n-util.async.ts file

// Stub types for when typesafe-i18n is not set up
type Locales = string;
type Translations = Record<string, any>;

// Stub implementation - does nothing
// This will be replaced by the real implementation when typesafe-i18n is set up
export const importLocaleAsync = async (locale: Locales): Promise<Translations> => {
	return {};
};

export const loadLocaleAsync = async (locale: Locales): Promise<void> => {};

export const loadAllLocalesAsync = (): Promise<void[]> => {
	return Promise.resolve([]);
};

export const loadFormatters = (locale: Locales): void => {};
