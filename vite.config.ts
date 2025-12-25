import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import type { Config } from 'vite-plugin-config';
import tailwindcss from '@tailwindcss/vite';

// Language configuration
const languageConfig = {
	enabled: false,
	icon: 'languages',
	showName: false,
	availableLocales: [
		{ code: 'en', name: 'English' },
		{ code: 'ru', name: 'Русский' },
		{ code: 'sk', name: 'Slovenčina' }
	],
	defaultLocale: 'en',
	autoDetect: true
};

const siteConfig: Config = {
	title: 'Mota ₡ore', // Site title - keep `₡ore` if you want to let people know it's powered by Core Infra
	url: 'http://localhost:5173', // Site domain
	organizationName: 'bchainhub', // Organization name - In most cases it's your GitHub username
	projectName: 'sveltekit-mota', // Project name - In most cases it's your repo name
	supportLink: 'https://github.com/bchainhub/sveltekit-mota/issues', // Support link - In most cases it's your GitHub issues page
	favicon: '/img/icons/favicon.png', // Favicon path in static folder
	themeConfig: {
		navbar: {
			logo: {
				src: '/img/logo.svg', // Logo path in static folder
				srcDark: '/img/logo-dark.svg', // Logo path in static folder
				alt: 'Mota', // Logo alt attribute
				appendTitle: false // Append title to logo
			},
			style: 'blur', // Navbar style (auto, blur, transparent)
			orientation: 'horizontal', // Navbar orientation (horizontal, vertical)
			hideOnScroll: false, // Hide navbar on scroll down
			iconExternal: true, // Icon for external links
			leftItemsPosition: 'center', // Left items position (left, center)
			items: [
				// Navbar items
				{
					label: 'navbar.home',
					to: '/',
					position: 'left',
					icon: 'home'
				},
				{
					label: 'navbar.support',
					to: '/support',
					position: 'left'
				},
				{
					label: 'navbar.register',
					to: '/register',
					position: 'right',
					icon: 'corepass',
					className: 'border border-white rounded-full px-4 py-2'
				}
			],
			authItems: [
				// Auth items
				{
					label: 'navbar.profile',
					to: '/profile'
				},
				{
					label: 'navbar.settings',
					to: '/settings'
				}
			]
		},
		footer: {
			style: 'transparent', // Footer style (auto, dark, light, transparent)
			logo: {
				src: '/img/logo-footer.svg', // Logo path in static folder
				alt: 'Mota' // Logo alt attribute
			},
			iconExternal: true, // Icon for external links
			links: [
				// Footer links
				{
					title: 'footer.ecosystem',
					items: [
						{ label: 'footer.onRamp', href: 'https://coreport.net', target: '_blank' },
						{ label: 'footer.moneyX', href: 'https://moneyx.forex', target: '_blank' },
						{ label: 'footer.commodities', href: 'https://payto.money', target: '_blank' }
					]
				},
				{
					title: 'footer.applications',
					items: [
						{ label: 'footer.corePass', href: 'https://corepass.net', target: '_blank' },
						{ label: 'footer.oricRegistry', href: 'https://payto.onl/services/oric', target: '_blank' }
					]
				},
				{
					title: 'footer.developers',
					items: [
						{ label: 'footer.exchangeRates', href: 'https://moneyx.forex/exchange-rates', target: '_blank' },
						{ label: 'footer.merchants', href: 'https://coreport.net/generate', target: '_blank' },
						{ label: 'footer.api', href: 'https://postman.com', target: '_blank' }
					]
				},
				{
					title: 'footer.contact',
					items: [
						{ label: 'footer.emailContact', to: 'mailto:support@mota' },
						{ label: 'footer.support', to: '/support' },
						{ label: 'footer.coreTalk', href: 'https://coretalk.space', target: '_blank' }
					]
				}
			],
			liner: [
				// Footer liner
				{
					label: 'footer.termsOfService',
					to: '/terms'
				},
				{
					label: 'footer.privacyPolicy',
					to: '/privacy'
				},
				{ label: 'footer.keyRegistry', to: '/keys' }
			],
			copyright: 'footer.copyright' // Copyright text
		},
		metadata: [
			{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }, // Viewport meta tag
			{ name: 'theme-color', content: '#25c19f' }, // Theme color meta tag
			{ name: 'description', content: 'This is SvetleKit Boilerplate website' }, // Description meta tag
			{ name: 'keywords', content: 'mota, website, sveltekit, vite' }, // Keywords meta tag
			{ property: 'og:type', content: 'website' }, // Open Graph type meta tag
		],
		colorMode: {
			defaultMode: 'dark', // Default color mode
			disableSwitch: false, // Disable color mode switch
			respectPrefersColorScheme: true // Respect browser color scheme preference
		}
	},
	community: {
		url: 'https://github.com/bchainhub/sveltekit-mota'
	},
	auth: {
		enabled: false,
		title: 'auth.login',
		icon: 'login',
		strategy: 'passkey',
		passkey: {
			aaguid: [],
			algorithms: ['ES256', 'ES384', 'ES512', 'RS256', 'RS384', 'RS512', 'PS256', 'PS384', 'PS512'],
			attestation: 'none', // None attestation - privacy-friendly
			authenticatorAttachment: 'cross-platform', // Allow both built-in and external authenticators (QR code)
			origin: 'https://mota.web', // Origin of the passkey
			residentKey: 'preferred', // Discoverable credentials preferred
			rpId: 'mota.web', // RP ID of the passkey
			rpName: 'MOTA', // RP Name of the passkey
			timeout: 60000, // 60 seconds timeout
			userVerification: 'required', // Must perform biometric/PIN check
		},
		web3: {
			provider: 'corepass',
			methods: {
				requestAccounts: 'xcb_requestAccounts'
			}
		}
	},
	language: languageConfig
};

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['/icons/favicon.svg', 'robots.txt', '/icons/apple-touch-icon.png'],
			manifest: {
				name: 'Mota',
				short_name: 'WM',
				description: 'MOTA Starter Pack',
				theme_color: '#45a699',
				icons: [
					{
						src: '/icons/192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: '/icons/512.png',
						sizes: '512x512',
						type: 'image/png'
					},
					{
						src: '/icons/512.png',
						sizes: '512x512',
						type: 'image/png',
						purpose: 'any maskable'
					}
				]
			}
		})
	],
	define: {
		__SITE_CONFIG__: JSON.stringify(siteConfig)
	}
});
