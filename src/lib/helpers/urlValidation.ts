/**
 * URL validation utilities for secure URL handling
 */

/**
 * Validates if a given URL is using HTTPS and has a valid domain name.
 * Skips validation if the environment is set to "development".
 *
 * @param url - The URL to validate
 * @returns true if the URL is valid, false otherwise
 */
export function validateSecureUrl(url: string): boolean {
	// Skip validation in development mode
	if (process.env.NODE_ENV === 'development') {
		return true;
	}

	try {
		const parsedUrl = new URL(url);

		// Ensure the protocol is HTTPS
		if (parsedUrl.protocol !== 'https:') {
			return false;
		}

		// Validate the domain with a regex that matches valid domain names
		const domainRegex = /^(?!-)[A-Za-z0-9-]{1,63}(?<!-)\.[A-Za-z]{2,}$/;
		return domainRegex.test(parsedUrl.hostname);
	} catch (error) {
		// Invalid URL format
		return false;
	}
}
