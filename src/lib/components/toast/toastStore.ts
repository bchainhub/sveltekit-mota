import { writable } from 'svelte/store';
import type { Toast, ToastMethods } from './types';

export const toasts = writable<Toast[]>([]);

function createToast(): ToastMethods {
	const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;

	const addToast = (
		message: string,
		type: 'success' | 'error' | 'info' | 'warning',
		duration: number = 3000,
		className?: string
	) => {
		const id = generateId();
		const toast: Toast = { id, message, type, duration, className };
		toasts.update((current) => [...current, toast]);

		// Always set a timeout to remove the toast
		setTimeout(() => {
			toasts.update((current) => current.filter((t) => t.id !== id));
		}, duration);
	};

	return {
		success: (message, duration = 3000, className) =>
			addToast(message, 'success', duration, className),
		error: (message, duration = 4000, className) => addToast(message, 'error', duration, className),
		info: (message, duration = 3000, className) => addToast(message, 'info', duration, className),
		warning: (message, duration = 4000, className) =>
			addToast(message, 'warning', duration, className)
	};
}

export const toast = createToast();
