<script lang="ts">
	import { Header, Footer } from '$lib/components';

	const {
		title,
		themeConfig: { metadata, navbar },
		favicon
	} = __SITE_CONFIG__;
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
		class={`header-wrapper ${navbar && navbar.orientation === 'vertical' ? 'md:flex-shrink-0 md:h-auto max-md:contents' : 'contents'}`}
	>
		<Header />
	</div>
	<main
		class={`container flex-1 mx-auto p-4 ${navbar && navbar.orientation === 'vertical' ? '' : 'pt-8'}`}
	>
		<slot />
	</main>
</div>
<Footer />
