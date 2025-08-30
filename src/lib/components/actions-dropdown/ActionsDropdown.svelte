<script lang="ts">
	const {
		title = null,
		items = [],
		open: initialOpen = false,
		position = 'left',
		isSmall = false,
		iconExternal = true,
		className = '',
		onChange
	} = $props<{
		title: string | null;
		items: MenuItem[];
		open?: boolean;
		position?: 'left' | 'right';
		isSmall?: boolean;
		iconExternal?: boolean;
		className?: string;
		onChange?: (event: CustomEvent<{ label: string; action?: () => void }>) => void;
	}>();

	let isOpen = $state(initialOpen);

	$effect(() => {
		isOpen = initialOpen;
	});

	$effect(() => {
		if (typeof window !== 'undefined' && window.document) {
			const event = new CustomEvent('update:open', { detail: isOpen });
			document.dispatchEvent(event);
		}
	});

	import { onMount, onDestroy } from 'svelte';
	import { Icon } from '$lib/components';
	import { ChevronDown, ChevronUp, ArrowUpRight } from 'lucide-svelte';
	import ICAN from '@blockchainhub/ican';
	import { blo } from '@blockchainhub/blo';

	let dropdownRef: HTMLDivElement | null = null;

	const handleItemClick = (item: MenuItem, event: Event) => {
		if (item.action) {
			item.action();
			isOpen = false;
			onChange?.(new CustomEvent('change', { detail: item }));
		} else if (item.href) {
			return;
		}
		event.preventDefault();
	};

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
			isOpen = false;
		}
	};

	const handleToggle = () => {
		isOpen = !isOpen;
	};

	onMount(() => {
		document.addEventListener('click', handleClickOutside, true);
	});

	onDestroy(() => {
		document.removeEventListener('click', handleClickOutside, true);
	});
</script>

<div
	class={`relative inline-block ${isSmall ? 'w-full' : 'text-left'} ${className}`}
	bind:this={dropdownRef}
>
	<div>
		<button
			type="button"
			class="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-xs px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-hidden"
			onclick={handleToggle}
		>
			{#if title}
				<img alt={title} src={blo(title)} class="w-32 h-32 rounded-lg" />
				<span class="ml-2">{ICAN.shortFormat(title)}</span>
			{:else}
				<span>Menu</span>
			{/if}
			{#if isOpen}
				<ChevronUp class="ml-2 h-5 w-5" />
			{:else}
				<ChevronDown class="ml-2 h-5 w-5" />
			{/if}
		</button>
	</div>

	{#if isOpen}
		<div
			class={`origin-top-${position} absolute ${position}-0 mt-2 ${isSmall ? 'w-full' : 'w-56'} rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-hidden`}
		>
			<div class="py-1">
				{#each items as item (item.label)}
					<a
						href={item.href || '#'}
						target={item.target || '_self'}
						class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center"
						onclick={(e) => handleItemClick(item, e)}
					>
						{#if item.icon}
							<Icon name={item.icon} className="h-4 w-4 mr-1.5" />
						{/if}
						{item.label}
						{#if item.href && iconExternal}
							<ArrowUpRight class="ml-1 h-4 w-4" />
						{/if}
					</a>
				{/each}
			</div>
		</div>
	{/if}
</div>
