<script lang="ts">
	import { Header, Footer } from '$lib/components';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';
	import type { LayoutData } from './$types';
	import { applyLocale } from '$lib/helpers/i18n';
	import { detectLocale } from 'typesafe-i18n/detectors';

	export let data: LayoutData;

	const {
		themeConfig: { metadata, navbar },
		language,
		title,
		favicon
	} = __SITE_CONFIG__;

	const enabled = language?.enabled || false;

	// apply server-provided locale reactively, but prioritize localStorage
	$: if (enabled && browser) {
		const storedLocale = localStorage.getItem('locale');
		let finalLocale = data.locale;

		// Priority 1: localStorage if valid
		if (storedLocale && language?.availableLocales?.some(loc => loc.code === storedLocale)) {
			finalLocale = storedLocale;
		}
		// Priority 2: URL locale if valid and no stored locale
		else if (!storedLocale && (data as any).fromUrl && language?.availableLocales?.some(loc => loc.code === data.locale)) {
			finalLocale = data.locale;
			// Store URL locale in localStorage for future visits
			localStorage.setItem('locale', data.locale);
		}
		// Priority 3: Auto-detect if no stored locale and auto-detect is enabled
		else if (!storedLocale && language?.autoDetect) {
			const detectedLocale = detectLocale(navigator.language, language.availableLocales?.map(loc => loc.code) || []);
			if (detectedLocale && language?.availableLocales?.some(loc => loc.code === detectedLocale)) {
				finalLocale = detectedLocale;
				// Store detected locale in localStorage for future visits
				localStorage.setItem('locale', detectedLocale);
			} else {
				// Auto-detection failed or disabled, fall back to default locale
				finalLocale = language?.defaultLocale || 'en';
			}
		}
		// Priority 4: Fallback to default locale if no other method worked
		else if (!storedLocale && !language?.autoDetect) {
			finalLocale = language?.defaultLocale || 'en';
		}

		document.documentElement.setAttribute('lang', finalLocale);
		applyLocale(finalLocale);
	}

	let isNavHidden = false;

	const handleNavHiddenChange = (event: CustomEvent) => {
		isNavHidden = event.detail.isHidden;
	};

	onMount(() => {
		if (browser) {
			document.addEventListener('navHiddenChange', handleNavHiddenChange as EventListener);
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('navHiddenChange', handleNavHiddenChange as EventListener);
		}
	});
</script>

<svelte:head>
	<title>{title}</title>
	{#if favicon}
		<link rel="icon" href={favicon} type="image/png" />
	{/if}
	{#if metadata}
		{#each metadata as { name, content, property }}
			{#if name}
				<meta {name} {content} />
			{/if}
			{#if property}
				<meta {property} {content} />
			{/if}
		{/each}
	{/if}
</svelte:head>

<div
	class={`view ${navbar && navbar.orientation === 'vertical' ? 'vertical-max-w flex flex-col lg:flex-row lg:mx-auto lg:container' : 'flex flex-col'}`}
>
	<div
		class={`header-wrapper ${navbar && navbar.orientation === 'vertical' ? 'lg:flex-shrink-0 lg:h-auto max-lg:contents transition-all duration-500 ease-in-out' : 'contents'} ${navbar && navbar.orientation === 'vertical' && navbar.hideOnScroll && isNavHidden ? 'lg:hidden' : ''}`}
	>
		<Header />
	</div>
	<main
		class={`container flex-1 mx-auto px-4 xl:px-0 ${navbar && navbar.orientation === 'vertical' ? '' : 'pt-8'}`}
	>
		<slot />
	</main>
</div>
<Footer />
