import { writable } from 'svelte/store';
import type { Toast, ToastMethods } from './types';

export const toasts = writable<Toast[]>([]);

function createToast(): ToastMethods {
	const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
	const timeouts = new Map<string, ReturnType<typeof setTimeout>>();
	const toastStartTimes = new Map<string, number>(); // Track when each toast started
	const pausedToasts = new Map<string, number>(); // Store remaining time for paused toasts

	const addToast = (
		message: string,
		type: 'success' | 'error' | 'info' | 'warning',
		duration: number = 5000,
		className?: string
	) => {
		const id = generateId();
		const toast: Toast = { id, message, type, duration, className };
		toasts.update((current) => [...current, toast]);

		// Clear any existing timeout for this toast
		if (timeouts.has(id)) {
			clearTimeout(timeouts.get(id)!);
			timeouts.delete(id);
		}

		// Record start time
		toastStartTimes.set(id, Date.now());

		// Set a timeout to remove the toast using the toast's actual duration
		const timeout = setTimeout(() => {
			toasts.update((current) => current.filter((t) => t.id !== id));
			timeouts.delete(id);
			toastStartTimes.delete(id);
			pausedToasts.delete(id);
		}, duration);

		timeouts.set(id, timeout);
	};

	const removeToast = (id: string) => {
		toasts.update((current) => current.filter((t) => t.id !== id));
		if (timeouts.has(id)) {
			clearTimeout(timeouts.get(id)!);
			timeouts.delete(id);
		}
		toastStartTimes.delete(id);
		pausedToasts.delete(id);
	};

	const pauseToast = (id: string) => {
		if (timeouts.has(id) && toastStartTimes.has(id)) {
			const timeout = timeouts.get(id)!;
			clearTimeout(timeout);
			timeouts.delete(id);

			// Calculate remaining time based on elapsed time
			const startTime = toastStartTimes.get(id)!;
			const elapsedTime = Date.now() - startTime;

			// We need to get the current toasts to find the duration
			let currentToasts: Toast[] = [];
			const unsubscribe = toasts.subscribe((toasts) => {
				currentToasts = toasts;
			});
			unsubscribe(); // Immediately unsubscribe after getting current value

			const toast = currentToasts.find(t => t.id === id);
			if (toast) {
				const totalDuration = toast.duration || 5000;
				const remainingTime = Math.max(0, totalDuration - elapsedTime);
				pausedToasts.set(id, remainingTime);
			}
		}
	};

	const resumeToast = (id: string) => {
		if (pausedToasts.has(id)) {
			const remainingTime = pausedToasts.get(id)!;
			pausedToasts.delete(id);

			// Record new start time for the remaining duration
			toastStartTimes.set(id, Date.now());

			const timeout = setTimeout(() => {
				toasts.update((current) => current.filter((t) => t.id !== id));
				timeouts.delete(id);
				toastStartTimes.delete(id);
				pausedToasts.delete(id);
			}, remainingTime);

			timeouts.set(id, timeout);
		}
	};

	return {
		success: (message, duration = 5000, className) =>
			addToast(message, 'success', duration, className),
		error: (message, duration = 5000, className) => addToast(message, 'error', duration, className),
		info: (message, duration = 5000, className) => addToast(message, 'info', duration, className),
		warning: (message, duration = 5000, className) =>
			addToast(message, 'warning', duration, className),
		remove: removeToast,
		pause: pauseToast,
		resume: resumeToast,
		clear: () => {
			timeouts.forEach(timeout => clearTimeout(timeout));
			timeouts.clear();
			toastStartTimes.clear();
			pausedToasts.clear();
			toasts.set([]);
		}
	};
}

export const toast = createToast();
