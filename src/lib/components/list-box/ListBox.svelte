<script lang="ts">
	import { writable } from 'svelte/store';
	import { slide } from 'svelte/transition';

	export let items: (
		| { value: string | number; label: string; ticker?: string; group?: string }
		| { group: string; items: { value: string | number; label: string; ticker?: string }[] }
	)[] = [];
	export let value: string | number;
	export let id: string = '';
	export let onChange: (value: string | number) => void = () => {};

	let selectedValue = value;
	const expanded = writable(false);
	$: selectedValue = value;

	let dropdownElement: HTMLDivElement | null = null;

	function toggle() {
		expanded.update((e) => !e);
	}

	function select(item: { value: string | number; label: string; ticker?: string }) {
		if (String(selectedValue) === String(item.value)) {
			expanded.update((e) => !e);
			return;
		}
		selectedValue = item.value;
		expanded.set(false);
		onChange(item.value);
	}

	function handleOutsideClick(event: MouseEvent) {
		if (dropdownElement && !dropdownElement.contains(event.target as Node)) {
			expanded.set(false);
		}
	}

	function isCategory(
		item: any
	): item is {
		group: string;
		items: { value: string | number; label: string; ticker?: string }[];
	} {
		return item.items && Array.isArray(item.items);
	}

	$: selectedLabel = (() => {
		for (const item of items) {
			if (isCategory(item)) {
				const selectedItem = item.items.find((subItem) => String(subItem.value) === String(selectedValue));
				if (selectedItem) return selectedItem.label;
			} else if (String(item.value) === String(selectedValue)) {
				return item.label;
			}
		}
		return 'Select an option';
	})();
</script>

<div class="relative w-full dropdown" bind:this={dropdownElement}>
	<button
		{id}
		type="button"
		on:click={toggle}
		aria-label="Toggle dropdown"
		class="inline-flex items-center justify-between bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border-2 border-slate-200 dark:border-slate-600 w-full px-3 py-2 rounded-md cursor-pointer focus:outline-hidden focus-visible:ring-4 focus-visible:ring-opacity-75 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-200"
	>
		<span class="truncate">{selectedLabel}</span>
		<span class="ml-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
				stroke-width="1.5"
				stroke="currentColor"
				class="w-5 h-5 text-slate-500 dark:text-slate-400"
			>
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					d="M8.25 15l3.75 3.75L15.75 15m-7.5-6l3.75-3.75L15.75 9"
				/>
			</svg>
		</span>
	</button>

	{#if $expanded}
		<ul
			class="absolute mt-1 max-h-60 w-full overflow-auto rounded-md shadow-lg z-10 ring-1 ring-slate-200 dark:ring-slate-600 ring-opacity-5 focus:outline-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600"
			tabindex="-1"
			in:slide={{ duration: 200 }}
			out:slide={{ duration: 100 }}
		>
			{#each items as item}
				{#if isCategory(item)}
					<li class="bg-emerald-100 dark:bg-emerald-900/20 px-3 py-1 text-sm font-semibold text-emerald-800 dark:text-emerald-200">{item.group}</li>
					{#each item.items as subItem}
						<li>
							<button
								type="button"
								aria-label={subItem.label}
								on:click={() => select(subItem)}
								on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && select(subItem)}
								class="flex items-center w-full px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200"
							>
								{#if String(selectedValue) === String(subItem.value)}
									<span class="w-3 h-3 mr-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
								{:else}
									<span class="w-3 h-3 mr-2 border border-slate-300 dark:border-slate-600 rounded-full"></span>
								{/if}
								<span class="flex-1 text-left">{subItem.label}</span>
								{#if subItem.ticker}
									<span class="text-sm">{subItem.ticker}</span>
								{/if}
							</button>
						</li>
					{/each}
				{:else}
					<li>
						<button
							type="button"
							aria-label={item.label}
							on:click={() => select(item)}
							on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && select(item)}
							class="flex items-center w-full px-3 py-2 text-slate-900 dark:text-slate-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors duration-200"
						>
							{#if String(selectedValue) === String(item.value)}
								<span class="w-3 h-3 mr-2 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
							{:else}
								<span class="w-3 h-3 mr-2 border border-slate-300 dark:border-slate-600 rounded-full"></span>
							{/if}
							<span class="flex-1 text-left">{item.label}</span>
							{#if item.ticker}
								<span class="text-sm">{item.ticker}</span>
							{/if}
						</button>
					</li>
				{/if}
			{/each}
		</ul>
	{/if}
</div>

<svelte:window on:click={handleOutsideClick} />
