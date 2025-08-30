import { type RequestHandler } from '@sveltejs/kit';

export const handleOptions: RequestHandler = async () => {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type, Authorization'
		}
	});
};

export function withCorsHeaders(response: Response) {
	const headers = new Headers(response.headers);
	headers.set('Access-Control-Allow-Origin', '*');
	headers.set('X-APP-Version', import.meta.env.VITE_APP_VERSION);

	return new Response(response.body, {
		status: response.status,
		statusText: response.statusText,
		headers
	});
}
