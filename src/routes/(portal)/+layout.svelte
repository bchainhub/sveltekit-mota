<script lang="ts">
	import { Header, Footer } from '$lib/components';
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	const {
		title,
		themeConfig: { metadata, navbar },
		favicon
	} = __SITE_CONFIG__;

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
	class={`view ${navbar && navbar.orientation === 'vertical' ? 'vertical-max-w flex flex-col md:flex-row md:mx-auto md:container' : 'flex flex-col'}`}
>
	<div
		class={`header-wrapper ${navbar && navbar.orientation === 'vertical' ? 'md:flex-shrink-0 md:h-auto max-md:contents' : 'contents'} ${navbar && navbar.orientation === 'vertical' && navbar.hideOnScroll && isNavHidden ? 'md:hidden' : ''}`}
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
