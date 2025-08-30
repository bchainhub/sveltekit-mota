<script lang="ts">
	import { ArrowUpRight } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { ChevronRight } from 'lucide-svelte';

	const { style, logo, copyright, liner, links, iconExternal } =
		__SITE_CONFIG__?.themeConfig?.footer || {};
	const footerClass = style && `footer-${style}`;

	let connectionStatus: boolean = false;
	let pathSegments: { name: string; url: string; current: boolean }[] = [];

	// Function to convert kebab-case to capitalized words with spaces
	function kebabToCapitalized(str: string): string {
		return str
			.split('-')
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(' ');
	}

	// Parse URL and create breadcrumb segments
	$: if ($page && $page.url) {
		const path = $page.url.pathname;
		const segments = path.split('/').filter((segment) => segment);

		pathSegments = [{ name: 'Home', url: '/', current: segments.length === 0 }];

		let currentPath = '';
		segments.forEach((segment, index) => {
			currentPath += `/${segment}`;
			pathSegments.push({
				name: kebabToCapitalized(segment),
				url: currentPath,
				current: index === segments.length - 1
			});
		});
	}

	onMount(() => {
		const updateConnectionStatus = () => {
			connectionStatus = navigator.onLine ? true : false;
		};

		updateConnectionStatus();

		window.addEventListener('online', updateConnectionStatus);
		window.addEventListener('offline', updateConnectionStatus);

		return () => {
			window.removeEventListener('online', updateConnectionStatus);
			window.removeEventListener('offline', updateConnectionStatus);
		};
	});
</script>

<footer class={`footer ${footerClass}`}>
	<div class="container mx-auto py-4">
		<nav aria-label="breadcrumb">
			<ol class="inline-flex items-center rounded text-sm font-medium">
				{#each pathSegments as segment, index}
					<li class="inline-flex items-center" aria-current={segment.current ? 'page' : undefined}>
						{#if index > 0}
							<ChevronRight class="h-5 w-5 text-gray-400 mx-2" />
						{/if}
						<a
							href={segment.url}
							class={segment.current
								? 'text-secondary-700'
								: 'text-secondary-500 hover:text-secondary-600'}
						>
							{segment.name}
						</a>
					</li>
				{/each}
			</ol>
		</nav>

		<hr class="my-2 !border-gray-500/50" />

		<!-- Footer Links Section -->
		{#if links && links.length > 0}
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 mb-8">
				{#each links as section}
					<div>
						<h4 class="text-lg font-semibold mb-2">
							{section.title}
						</h4>
						<ul class="space-y-2">
							{#each section.items as item}
								<li class="text-sm">
									{#if item.to}
										<a href={item.to} class="hover:text-primary-600 transition duration-150">
											{item.label}
										</a>
									{:else if item.href}
										<a
											href={item.href}
											target={item.target ? item.target : undefined}
											rel={item.target ? 'noopener noreferrer' : undefined}
											class="hover:text-primary-600 transition duration-150 flex items-center"
										>
											{item.label}
											{#if typeof iconExternal === 'undefined' || iconExternal === true}
												<ArrowUpRight class="h-4 w-4 ml-1" />
											{/if}
										</a>
									{/if}
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</div>
		{/if}

		<div class="flex flex-col md:flex-row gap-4 items-center mb-2 mt-4">
			{#if logo}
				<a href="/" class="flex items-center mb-4 md:mb-0">
					<img src={logo.src} alt={logo.alt} class="h-10" />
				</a>
			{:else if __SITE_CONFIG__?.title}
				<a href="/" class="flex items-center mb-4 md:mb-0">
					<h1 class="text-xl font-bold">{__SITE_CONFIG__.title}</h1>
				</a>
			{/if}
			<div class="text-center text-sm text-footer-link mt-4 md:mt-0">
				{copyright}
			</div>
			{#if liner}
				<div
					class="flex flex-wrap justify-center text-sm md:justify-start gap-4 mt-4 md:mt-0 md:ml-4"
				>
					{#each liner as { label, to, href, target }}
						<div class="flex items-center">
							{#if to}
								<a href={to} class="hover:text-footer-link-hover">
									{label}
								</a>
							{:else if href}
								<a
									{href}
									target={target ? target : undefined}
									rel={target ? 'noopener noreferrer' : undefined}
									class="hover:text-footer-link-hover flex items-center"
								>
									{label}
									{#if typeof iconExternal === 'undefined' || iconExternal === true}
										<ArrowUpRight class="h-4 w-4" />
									{/if}
								</a>
							{/if}
						</div>
					{/each}
				</div>
			{/if}
			<div class="mt-4 md:mt-0 md:ml-auto flex items-center gap-4">
				<div class="flex items-center gap-2">
					<span
						class="status-dot inline-block w-1.5 h-1.5 rounded-full {connectionStatus
							? 'connected'
							: ''}"
					></span>
					<p class="text-sm text-footer-link">{connectionStatus ? 'Online' : 'Offline'}</p>
				</div>
			</div>
		</div>
	</div>
</footer>
