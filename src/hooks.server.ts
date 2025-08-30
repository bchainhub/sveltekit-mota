import { getGeoData } from '$lib/helpers/geo';
import { json, type Handle } from '@sveltejs/kit';
import { ApiError } from '$lib/server/apiError';

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

export const handle: Handle = async ({ event, resolve }) => {
	try {
		getGeoData(event);

		const response = await resolve(event);

		if (event.url.pathname.startsWith('/api') && response.status >= 400) {
			try {
				const data = await response.clone().json();
				// If it's already an ApiError format, return it as is
				if (data.status === 'error') {
					return json(data, {
						status: data.code,
						headers: {
							'Access-Control-Allow-Origin': '*',
							'X-APP-Version': import.meta.env.VITE_APP_VERSION
						}
					});
				}
			} catch {}
		}

		return response;
	} catch (error) {
		if (event.url.pathname.startsWith('/api')) {
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
