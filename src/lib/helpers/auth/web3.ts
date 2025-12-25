import { writable } from 'svelte/store';
import { toast } from '$lib/components';
import { browser } from '$app/environment';

type Web3Config = NonNullable<NonNullable<typeof __SITE_CONFIG__['auth']>['web3']>;

// Extend Window interface to include CorePass
declare global {
	interface Window {
		ethereum?: any;
		corepass?: any;
	}
}

export function getWeb3Config(): Required<Pick<Web3Config, 'provider' | 'methods'>> & Partial<Web3Config> {
	const cfg = (__SITE_CONFIG__.auth?.web3 ?? {}) as Web3Config;
	if (!cfg.provider || !cfg.methods?.requestAccounts) {
		throw new Error('Web3 configuration is not valid.');
	}
	return {
		provider: cfg.provider as string,
		methods: {
			requestAccounts: cfg.methods?.requestAccounts
		},
		...cfg
	};
}

export function detectProvider(): { type: string | null; provider: any | null } {
	if (!browser) return { type: null, provider: null };
	// CorePass extension injects window.corepass
	if (typeof (window as any).corepass !== 'undefined') {
		return { type: 'corepass' as const, provider: (window as any).corepass };
	}
	// MetaMask injects window.ethereum and flags isMetaMask
	if (typeof (window as any).ethereum !== 'undefined' && (window as any).ethereum?.isMetaMask) {
		return { type: 'metamask' as const, provider: (window as any).ethereum };
	}
	return { type: null, provider: null };
}

export async function requestAccounts(providerType?: string): Promise<string[]> {
	const { type, provider } = detectProvider();
	const cfg = getWeb3Config();
	const selected = providerType || type;
	if (!selected || !provider) return [];
	return await provider.request({ method: cfg.methods.requestAccounts }) || [];
}

// Svelte stores for wallet state
export const walletConnected = writable(false);
export const walletType = writable<string | null>(null);
export const walletAddress = writable<string | null>(null);

// Automatically login and connect wallet
export async function autoLogin() {
	await connectWallet(false);
}

// Connect to wallet (CorePass or MetaMask)
export async function connectWallet(automessage: boolean = true, messages?: Record<string, string>) {
	const { type } = detectProvider();
	const cfg = getWeb3Config();
	try {
		const accounts = await requestAccounts(type || (cfg.provider as any));
		if (accounts && accounts.length > 0) {
			const resolvedType = type || (cfg.provider as any);
			walletType.set(resolvedType);
			walletAddress.set(accounts[0]);
			walletConnected.set(true);
			return;
		}
		toast.warning(messages?.walletNotConfigured || 'Wallet is not configured or returned no accounts.');
	} catch (error) {
		console.error('Wallet connection failed:', error);
		if (automessage) {
			toast.warning(messages?.walletCannotConnect || 'Cannot connect wallet.');
		}
		return;
	}

	if (!type && automessage) {
		// No provider detected
		toast.warning(messages?.walletNotInstalled || 'No compatible wallet found.');
	}
}

// Disconnect the current wallet
export function disconnectWallet(messages?: Record<string, string>) {
	walletConnected.set(false);
	walletType.set(null);
	walletAddress.set(null);
	toast.success(messages?.walletDisconnected || 'Wallet disconnected.');
}
