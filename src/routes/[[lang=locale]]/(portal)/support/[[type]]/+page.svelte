<script lang="ts">
	import { page } from '$app/stores';
	import { Support } from '$lib/components/support';
	import { LL } from '../../../../../i18n/i18n-svelte';
	const siteConfig = __SITE_CONFIG__.support;
	// Get type from route params, default to 'ai'
	// Valid types: 'ai' or 'ticket'
	$: type = $page.params.type || 'ai';
	$: initialMode = (type === 'ticket' ? 'ticket' : 'ai') as 'ai' | 'ticket';
</script>

{#if siteConfig?.enabled}
	<Support mode={initialMode} />
{:else}
	<div class="flex flex-col items-center justify-center h-screen">
		<h1 class="text-2xl font-bold">{$LL.support.errors.supportIsNotAvailable() || 'Support is not available'}</h1>
	</div>
{/if}
