declare module 'vite-plugin-config' {
	export interface Config {
		title: string;
		url: string;
		organizationName?: string;
		projectName?: string;
		supportLink?: string;
		favicon?: string;
		themeConfig: {
			navbar?: {
				logo?: { src: string; srcDark: string; alt?: string; appendTitle?: boolean };
				items?: NavbarItem[];
				authItems?: NavbarItem[];
				style?: 'auto' | 'blur' | 'transparent';
				hideOnScroll?: boolean;
				orientation?: 'horizontal' | 'vertical';
				iconExternal?: boolean;
				leftItemsPosition?: 'left' | 'center';
			};
			footer?: {
				style?: 'light' | 'dark' | 'transparent';
				logo?: { src: string; alt?: string };
				links?: { title: string; items: FooterLinkItem[] }[];
				copyright?: string;
				liner?: FooterLinkItem[];
				iconExternal?: boolean;
			};
			metadata?: { name?: string; content: string; property?: string }[];
			colorMode?: {
				defaultMode?: 'light' | 'dark';
				disableSwitch?: boolean;
				respectPrefersColorScheme?: boolean;
				iconExternal?: boolean;
			};
		};
		community?: {
			url: string;
		};
		auth?: {
			enabled?: boolean;
			title?: string;
			icon?: string;
			provider?: string;
			strategy?: 'passkey' | 'web3';
			className?: string;
			passkey?: {
				aaguid?: string[];
				algorithms?: string[];
				attestation?: 'none' | 'indirect' | 'direct';
				authenticatorAttachment?: 'platform' | 'cross-platform';
				origin?: string;
				residentKey?: 'required' | 'preferred';
				rpId?: string;
				rpName?: string;
				timeout?: number;
				userVerification?: 'required' | 'preferred' | 'discouraged';
			};
			web3?: {
				provider?: string;
				chainId?: number;
				accountId?: string;
				methods?: Record<string, string>;
			};
			topMenu?: {
				items?: NavbarItem[];
			};
			sideMenu?: {
				items?: NavbarItem[];
			};
		};
		language?: {
			enabled?: boolean;
			icon?: string;
			showName?: boolean;
			availableLocales?: Array<{ code: string; name?: string }>;
			defaultLocale?: string;
			autoDetect?: boolean;
			className?: string;
		};
	}
}

declare const __SITE_CONFIG__: import('vite-plugin-config').Config;

interface NavbarItem {
	label?: string;
	to?: string;
	href?: string;
	position?: 'left' | 'right';
	target?: '_blank' | '_self' | '_parent' | '_top';
	rel?: string;
	icon?: string;
	className?: string;
	submenu?: NavbarItem[];
}

interface FooterLinkItem {
	label: string;
	to?: string;
	href?: string;
	target?: '_blank' | '_self' | '_parent' | '_top';
	rel?: string;
	icon?: string;
	className?: string;
}

type MenuItem = NavbarItem & {
	action?: () => void;
};

declare namespace App {
	interface Locals {
		country?: string;
		city?: string;
		locale?: string;
	}

	interface PageData {
		config?: import('vite-plugin-config').Config;
	}

	interface Platform {
		caches?: CacheStorage & { default: Cache };
		context?: {
			waitUntil(promise: Promise<any>): void;
		};
		env?: any;
		cf?: {
			[key: string]: string | undefined;
		};
	}
}
declare module '$env/dynamic/public' {
	export const PUBLIC_ENABLE_AUTH: string | undefined;
}

declare module '$env/dynamic/private' {
	export const CAPTURE_COUNTRY: string | undefined;
	export const CAPTURE_CITY: string | undefined;
}
