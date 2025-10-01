import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { json } from '@sveltejs/kit';
import { ApiError } from '$lib/server/apiError';
import { getGeoData } from '$lib/helpers/geo';

const statusMessages: Record<number, string> = {
	400: 'Bad Request',
	401: 'Unauthorized',
	403: 'Forbidden',
	404: 'Not Found',
	405: 'Method Not Allowed',
	408: 'Request Timeout',
	409: 'Conflict',
	429: 'Too Many Requests',
	500: 'Internal Server Error',
	501: 'Not Implemented',
	502: 'Bad Gateway',
	503: 'Service Unavailable',
	504: 'Gateway Timeout'
};

const handleApi: Handle = async ({ event, resolve }) => {
	try {
		// available for all requests
		getGeoData(event);

		// API routes bypass i18n/layout redirects
		if (event.url.pathname.startsWith('/api/')) {
			const response = await resolve(event);

			// normalize API error responses
			if (response.status >= 400) {
				try {
					const data = await response.clone().json();
					if (data.status === 'error') {
						return json(data, {
							status: data.code,
							headers: {
								'Access-Control-Allow-Origin': '*',
								'X-APP-Version': import.meta.env.VITE_APP_VERSION
							}
						});
					}
				} catch {
					/* ignore non-JSON */
				}
			}

			return response;
		}

		// Non-API routes: let the [[lang=locale]] layout handle i18n + redirects
		return resolve(event);
	} catch (error) {
		// Only wrap API errors here; non-API errors bubble to SvelteKit
		if (event.url.pathname.startsWith('/api/')) {
			if (error instanceof ApiError) {
				return json(
					{
						status: error.status,
						code: error.code,
						errorCode: error.errorCode,
						message: error.message,
						timestamp: new Date().toISOString()
					},
					{
						status: error.code,
						headers: {
							'Access-Control-Allow-Origin': '*',
							'X-API-Version': import.meta.env.VITE_APP_VERSION
						}
					}
				);
			}

			const status = error instanceof ApiError ? error.code : 500;
			const message =
				error instanceof ApiError
					? error.message
					: (statusMessages[500] ?? 'Internal Server Error');

			return json(
				{
					status: 'error',
					code: status,
					message,
					timestamp: new Date().toISOString(),
					...(import.meta.env.MODE === 'development' && {
						error: error instanceof Error ? error.stack : String(error)
					})
				},
				{
					status,
					headers: {
						'Access-Control-Allow-Origin': '*',
						'X-API-Version': import.meta.env.VITE_APP_VERSION
					}
				}
			);
		}

		throw error;
	}
};

export const handle = sequence(handleApi);
