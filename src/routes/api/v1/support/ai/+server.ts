import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';
import { handleOptions, withCorsHeaders } from '$lib/server/apiHandler';
import { ApiError } from '$lib/server/apiError';
import { env } from '$env/dynamic/private';
const siteConfig = __SITE_CONFIG__;

export const OPTIONS = handleOptions;

export const POST: RequestHandler = async ({ request, url }) => {
	if (!siteConfig.support?.ai?.enabled) {
		throw new ApiError('error', 403, 'Support AI service is not enabled');
	}
	try {
		// Check if AI is enabled
		if (!env.AI_API_KEY || !env.AI_API_URL) {
			throw new ApiError('error', 503, 'AI service is not configured');
		}

		// Verify request is from the same origin (protect against external usage)
		const origin = request.headers.get('origin');
		const referer = request.headers.get('referer');
		const allowedOrigin = siteConfig.url || url.origin;

		// Same-origin requests don't send Origin header, so null is valid
		// Cross-origin requests must have matching origin or referer
		if (origin !== null) {
			try {
				const originUrl = new URL(origin);
				const allowedUrl = new URL(allowedOrigin);
				if (originUrl.origin !== allowedUrl.origin) {
					// Check referer as fallback
					if (referer) {
						try {
							const refererUrl = new URL(referer);
							if (refererUrl.origin !== allowedUrl.origin) {
								throw new ApiError('error', 403, 'Forbidden: Request must come from the website');
							}
						} catch {
							throw new ApiError('error', 403, 'Forbidden: Request must come from the website');
						}
					} else {
						throw new ApiError('error', 403, 'Forbidden: Request must come from the website');
					}
				}
			} catch (err) {
				if (err instanceof ApiError) {
					throw err;
				}
				throw new ApiError('error', 403, 'Forbidden: Invalid origin');
			}
		}

		const body = await request.json();
		const { subject, question } = body;

		if (!subject || !question || typeof subject !== 'string' || typeof question !== 'string') {
			throw new ApiError('error', 400, 'Subject and question are required');
		}

		// Get system message from env or use default
		const defaultSystemMessage = 'You are a helpful support assistant. Provide clear, accurate, and helpful answers.';
		const systemMessage = [
			siteConfig.support?.ai?.systemMessage || defaultSystemMessage,
			`Current support subject: ${subject}`
		].join('\n\n');

		// Call AI API
		const aiResponse = await fetch(env.AI_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${env.AI_API_KEY}`
			},
			body: JSON.stringify({
				model: siteConfig.support?.ai?.model || 'gpt-4o-mini',
				messages: [
					{
						role: 'system',
						content: systemMessage
					},
					{
						role: 'user',
						content: question
					}
				],
				temperature: siteConfig.support?.ai?.temperature || 0.4,
				max_tokens: siteConfig.support?.ai?.maxTokens || 150
			})
		});

		if (!aiResponse.ok) {
			const errorData = await aiResponse.json().catch(() => ({}));
			throw new ApiError('error', aiResponse.status, `AI API error: ${errorData.error?.message || aiResponse.statusText}`);
		}

		const aiData = await aiResponse.json();
		const answer = aiData.choices?.[0]?.message?.content || 'No response from AI';

		const response = {
			status: 'success',
			data: {
				answer,
				subject,
				question
			}
		};

		return withCorsHeaders(json(response));
	} catch (error) {
		if (error instanceof ApiError) {
			throw error;
		}
		throw new ApiError('error', 500, 'Internal server error');
	}
};
