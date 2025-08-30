import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import type { Config } from 'vite-plugin-config';
import tailwindcss from '@tailwindcss/vite';

const siteConfig: Config = {
	title: 'MOTA', // Site title - keep `₡ore` if you want to let people know it's powered by Core Infra
	url: 'http://localhost:5173', // Site domain
	organizationName: 'bchainhub', // Organization name - In most cases it's your GitHub username
	projectName: 'sveltekit-mota', // Project name - In most cases it's your repo name
	supportLink: 'https://github.com/bchainhub/sveltekit-mota/issues', // Support link - In most cases it's your GitHub issues page
	favicon: '/img/icons/favicon.png', // Favicon path in static folder
	themeConfig: {
		navbar: {
			logo: {
				src: '/img/logo.svg', // Logo path in static folder
				alt: 'MOTA' // Logo alt attribute
			},
			style: 'auto', // Navbar style (auto, dark, light)
			orientation: 'horizontal', // Navbar orientation (horizontal, vertical)
			hideOnScroll: true, // Hide navbar on scroll down
			iconExternal: true, // Icon for external links
			items: [
				// Navbar items
				{
					label: 'Intro',
					to: '/',
					position: 'left',
					icon: 'link'
				}
			],
			authItems: [
				// Auth items
				{
					label: 'Profile',
					to: '/profile'
				},
				{
					label: 'Settings',
					to: '/settings'
				}
			]
		},
		footer: {
			style: 'transparent', // Footer style (auto, dark, light, transparent)
			logo: {
				src: '/img/logo-footer.svg', // Logo path in static folder
				alt: 'MOTA' // Logo alt attribute
			},
			iconExternal: true, // Icon for external links
			links: [
				// Footer links
				{
					title: 'Ecosystem',
					items: [
						{ label: 'Intro', to: '/' }
					]
				},
				{
					title: 'Resources',
					items: [
						{ label: 'About', href: 'https://github.com/bchainhub/sveltekit-starter', target: '_blank' }
					]
				},
				{
					title: 'Developers',
					items: [
						{ label: 'MOTA files', href: 'hhttps://github.com/bchainhub/sveltekit-mota', target: '_blank' }
					]
				},
				{
					title: 'Contact',
					items: [
						{ label: 'E-mail Contact', to: 'mailto:rastislav@onion.email' },
						{ label: 'Key Registry', to: '/keys' }
					]
				}
			],
			liner: [
				// Footer liner
				{
					label: 'Terms of Service',
					to: '/terms'
				}
			],
			copyright: `⊛ CORE 2025-${new Date().getFullYear()} MOTA` // Copyright text
		},
		metadata: [
			{ name: 'viewport', content: 'width=device-width, initial-scale=1.0' }, // Viewport meta tag
			{ name: 'theme-color', content: '#25c19f' }, // Theme color meta tag
			{ name: 'description', content: 'This is SvetleKit Boilerplate website' }, // Description meta tag
			{ name: 'keywords', content: 'mota, website, sveltekit, vite' }, // Keywords meta tag
			{ property: 'og:type', content: 'website' }, // Open Graph type meta tag
		],
		colorMode: {
			defaultMode: 'light', // Default color mode
			disableSwitch: true, // Disable color mode switch
			respectPrefersColorScheme: false // Respect browser color scheme preference
		},
		auth: {
			enabled: true,
			title: 'Connect'
		}
	},
	community: {
		url: 'https://github.com/bchainhub/sveltekit-starter'
	}
};

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		VitePWA({
			registerType: 'autoUpdate',
			includeAssets: ['/icons/favicon.svg', 'robots.txt', '/icons/apple-touch-icon.png'],
			manifest: {
				name: 'MOTA',
				short_name: 'MOTA',
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
