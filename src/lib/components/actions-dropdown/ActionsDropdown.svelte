<script lang="ts">
	import { browser } from '$app/environment';

	const {
		title = null,
		items = [],
		open: initialOpen = false,
		position = 'left',
		isSmall = false,
		iconExternal = true,
		className = '',
		orientation = 'horizontal',
		theme = 'blur',
		onChange
	} = $props<{
		title: string | null;
		items: MenuItem[];
		open?: boolean;
		position?: 'left' | 'right';
		isSmall?: boolean;
		iconExternal?: boolean;
		className?: string;
		orientation?: 'horizontal' | 'vertical';
		theme?: 'auto' | 'blur' | 'transparent';
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
	import { ChevronDown, ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-svelte';
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
		if (browser) {
			document.addEventListener('click', handleClickOutside, true);
		}
	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('click', handleClickOutside, true);
		}
	});
</script>

<!-- Desktop ActionsDropdown -->
<div class="relative lg:block hidden" bind:this={dropdownRef}>
	<button
		onclick={handleToggle}
		class="group {orientation === 'vertical' ? 'px-4 py-2 w-full justify-start' : 'px-1 py-2'} font-medium text-base flex items-center cursor-pointer transition-colors duration-200 {theme === 'auto' ? 'text-white hover:text-slate-300 dark:text-slate-900 dark:hover:text-slate-600' : theme === 'transparent' ? 'text-slate-900 hover:text-slate-600 dark:text-white dark:hover:text-slate-300' : 'text-white hover:text-slate-300'}"
		aria-expanded={isOpen}
		aria-haspopup="true"
	>
		{#if title}
			<img alt={title} src={blo(title)} class="w-6 h-6 rounded-full mr-2" />
			<span class="whitespace-nowrap">{ICAN.shortFormat(title)}</span>
		{:else}
			<span>Menu</span>
		{/if}
		{#if orientation === 'vertical'}
			<ChevronRight class="w-3 h-3 ml-1 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" />
		{:else}
			<ChevronDown class="w-3 h-3 ml-1 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}" />
		{/if}
	</button>

	<!-- Desktop Dropdown Menu -->
	{#if isOpen}
		<div class="absolute {orientation === 'vertical' ? 'left-full top-0 ml-2' : 'left-0 mt-2'} w-56 max-h-80 overflow-y-auto bg-slate-800 {theme === 'blur' ? 'backdrop-blur-md' : ''} rounded-lg shadow-lg border border-slate-700 z-50">
			{#if items && items.length > 0}
				{#each items as item}
					{#if item.href}
						<!-- External Link -->
						<button
							onclick={(e) => { e.stopPropagation(); handleItemClick(item, e); }}
							class="w-full flex items-center justify-start px-4 py-2 text-left hover:bg-slate-700 transition-colors text-slate-300 {item.active ? 'bg-slate-700' : ''} {item.className}"
						>
							{#if item.icon}
								<Icon name={item.icon} className="h-5 w-5 {item.label ? 'mr-1.5' : ''}" />
							{/if}
							{#if item.label}
								<span class="whitespace-nowrap">{item.label}</span>
							{/if}
							{#if iconExternal === true}
								<ArrowUpRight class="ml-1 h-4 w-4" />
							{/if}
						</button>
					{:else}
						<!-- Action Button -->
						<button
							onclick={(e) => { e.stopPropagation(); handleItemClick(item, e); }}
							class="w-full flex items-center justify-start px-4 py-2 text-left hover:bg-slate-700 transition-colors text-slate-300 {item.active ? 'bg-slate-700' : ''} {item.className}"
						>
							{#if item.icon}
								<Icon name={item.icon} className="h-5 w-5 {item.label ? 'mr-1.5' : ''}" />
							{/if}
							{#if item.label}
								<span class="whitespace-nowrap">{item.label}</span>
							{/if}
						</button>
					{/if}
				{/each}
			{/if}
		</div>
	{/if}
</div>

<!-- Mobile ActionsDropdown (SubmenuCompact style) -->
<div class="lg:hidden block">
	<button
		onclick={handleToggle}
		class="flex items-center justify-between w-full text-center text-white hover:text-indigo-400 transition-colors duration-200 px-4 py-8"
	>
		<div class="flex items-center justify-center flex-1">
			{#if title}
				<img alt={title} src={blo(title)} class="w-6 h-6 rounded-full mr-2" />
				<span>{ICAN.shortFormat(title)}</span>
			{:else}
				<span>Menu</span>
			{/if}
		</div>
		<ChevronRight className="h-5 w-5" />
	</button>

	<!-- Mobile Dropdown Overlay -->
	{#if isOpen}
		<div class="fixed top-0 left-0 right-0 bottom-0 z-50 bg-gray-800 transition-transform duration-300 translate-x-0" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.key === 'Enter' && e.stopPropagation()} role="button" tabindex="0">
			<div class="h-full overflow-y-auto" onclick={(e) => e.stopPropagation()} onkeydown={(e) => e.key === 'Enter' && e.stopPropagation()} role="button" tabindex="0">
				<ul class="flex flex-col text-xl">
					<!-- Back Button -->
					<li class="sticky top-0 z-20 bg-slate-900 flex justify-center border-b border-slate-600/30">
						<button
							onclick={(e) => { e.stopPropagation(); isOpen = false; }}
							class="flex items-center justify-between w-full text-center text-white hover:text-indigo-400 transition-colors duration-200 px-4 py-8"
						>
							<ChevronLeft className="h-5 w-5" />
							<span>Back</span>
							<div class="w-5"></div> <!-- Spacer to balance the layout -->
						</button>
					</li>

					<!-- Dropdown Items -->
					{#if items && items.length > 0}
						{#each items as item}
							<li class="flex justify-center w-full border-b border-slate-600/30">
								{#if item.href}
									<!-- External Link -->
									<button
										onclick={(e) => { e.stopPropagation(); handleItemClick(item, e); }}
										class="flex items-center justify-center w-full text-center text-white hover:text-indigo-400 transition-colors duration-200 px-4 py-8 {item.active ? 'text-indigo-400' : '' } {item.className}"
									>
										<div class="flex items-center">
											{#if item.icon}
												<Icon name={item.icon} className="h-5 w-5 mr-1.5" />
											{/if}
											<span>{item.label}</span>
											{#if typeof iconExternal === 'undefined' || iconExternal === true}
												<ArrowUpRight class="ml-1 h-4 w-4" />
											{/if}
										</div>
									</button>
								{:else}
									<!-- Action Button -->
									<button
										onclick={(e) => { e.stopPropagation(); handleItemClick(item, e); }}
										class="flex items-center justify-center w-full text-center text-white hover:text-indigo-400 transition-colors duration-200 px-4 py-8 {item.active ? 'text-indigo-400' : '' } {item.className}"
									>
										<div class="flex items-center">
											{#if item.icon}
												<Icon name={item.icon} className="h-5 w-5 mr-1.5" />
											{/if}
											<span>{item.label}</span>
										</div>
									</button>
								{/if}
							</li>
						{/each}
					{/if}
				</ul>
			</div>
		</div>
	{/if}
</div>
