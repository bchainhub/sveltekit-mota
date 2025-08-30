import { goto } from '$app/navigation';

/**
 * Navigates one level up in the URL path
 * Example: /exchange-rates/usd -> /exchange-rates
 * Example with params: /exchange-rates/usd?base=EUR -> /exchange-rates?base=EUR
 * @param currentPath The current URL path
 */
export function goUpOneLevel(currentPath: string): void {
	// Split the path and query parameters
	const [path, queryParams] = currentPath.split('?');
	const segments = path.split('/').filter(Boolean);

	if (segments.length > 0) {
		// Remove the last segment to go up one level
		segments.pop();
		const newPath = segments.length > 0 ? `/${segments.join('/')}` : '/';

		// Preserve query parameters if they exist
		const finalPath = queryParams ? `${newPath}?${queryParams}` : newPath;
		goto(finalPath);
	}
}
