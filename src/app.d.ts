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
				logo?: { src: string; alt: string };
				items?: NavbarItem[];
				authItems?: NavbarItem[];
				style?: 'auto' | 'transparent';
				hideOnScroll?: boolean;
				orientation?: 'horizontal' | 'vertical';
				iconExternal?: boolean;
			};
			footer?: {
				style?: 'light' | 'dark' | 'transparent';
				logo?: { src: string; alt: string };
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
			auth?: {
				enabled?: boolean;
				title?: string;
				providers?: {
					[key: string]: any;
				};
			};
		};
		community?: {
			url: string;
		};
	}
}

declare const __SITE_CONFIG__: import('vite-plugin-config').Config;

interface NavbarItem {
	label: string;
	to?: string;
	href?: string;
	position?: 'left' | 'right';
	target?: '_blank' | '_self' | '_parent' | '_top';
	icon?: string;
}

interface FooterLinkItem {
	label: string;
	to?: string;
	href?: string;
	target?: '_blank' | '_self' | '_parent' | '_top';
	icon?: string;
}

type MenuItem = NavbarItem & {
	action?: () => void;
};

declare namespace App {
	interface Locals {
		country?: string;
		city?: string;
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

interface Window {
	corepass?: {
		isCorePass?: boolean;
		request: (args: { method: string; params?: unknown[] }) => Promise<any>;
		on?: (eventName: string, callback: (...args: any[]) => void) => void;
		removeListener?: (eventName: string, callback: (...args: any[]) => void) => void;
	};
}
