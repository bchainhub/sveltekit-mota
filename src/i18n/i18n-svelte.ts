import { writable } from 'svelte/store';

// Dummy i18n-svelte that returns keys as strings
// Run: npm run typesafe-i18n
// This will overwrite the dummy implementation

// Create a proxy that returns the key as a string
const createDummyLL = () => {
	return new Proxy({}, {
		get(target, prop) {
			if (typeof prop === 'string') {
				// Return a function that returns the key path
				return (...args: any[]) => {
					// If called with arguments, interpolate them into the key
					if (args.length > 0 && typeof args[0] === 'object') {
						let result = prop;
						for (const [k, v] of Object.entries(args[0])) {
							result = result.replace(new RegExp(`\\{${k}\\}`, 'g'), v == null ? '' : String(v));
						}
						return result;
					}
					return prop;
				};
			}
			return createDummyLL();
		}
	});
};

// LL store with dummy implementation
export const LL = writable(createDummyLL());

// Set locale function
export const setLocale = (locale: string) => {
	console.debug('Dummy setLocale called with:', locale);
	// In a real implementation, you would load and set translations here
};

// Get current locale
export const getLocale = () => {
	return 'en';
};

// Load locale function
export const loadLocale = async (locale: string) => {
	console.debug('Dummy loadLocale called with:', locale);
	// In a real implementation, you would load translations from files or API
};
