import { writable } from 'svelte/store';
import { toast } from '$lib/components';

// Extend Window interface to include CorePass
declare global {
	interface Window {
		corepass?: {
			request: (params: { method: string }) => Promise<string[]>;
		};
	}
}

// Svelte stores for wallet state
export const walletConnected = writable(false);
export const walletType = writable<string | null>(null);
export const walletAddress = writable<string | null>(null);

// Automatically login and connect wallet
export async function autoLogin() {
	await connectWallet(false);
}

// Connect to CorePass wallet
export async function connectWallet(automessage: boolean = true, messages?: Record<string, string>) {
	// Check if CorePass is available
	if (typeof window.corepass !== 'undefined') {
		try {
			// Request account access from CorePass
			const accounts = await window.corepass.request({ method: 'xcb_requestAccounts' });

			if (accounts && accounts.length > 0) {
				// Set the wallet details in stores
				walletType.set('CorePass');
				walletAddress.set(accounts[0]);
				walletConnected.set(true);
			} else {
				toast.warning(messages?.corePassNotConfigured || 'CorePass Extension is not configured.');
				throw new Error('No accounts found.');
			}
		} catch (error) {
			console.error('CorePass connection failed:', error);
			toast.warning(messages?.corePassCannotConnect || 'Cannot connect CorePass Extension.');
		}
	} else if (automessage) {
		toast.warning(messages?.corePassNotInstalled || 'CorePass Extension is not installed or enabled.');
	}
}

// Disconnect the current wallet
export function disconnectWallet(messages?: Record<string, string>) {
	walletConnected.set(false);
	walletType.set(null);
	walletAddress.set(null);
	toast.success(messages?.corePassDisconnected || 'CorePass disconnected.');
}
