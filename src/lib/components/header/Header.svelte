<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { writable } from 'svelte/store';
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { ArrowUpRight, Eclipse, Menu, Moon, Sun, X } from 'lucide-svelte';
	import { ActionsDropdown, Icon, LanguageSwitcher, LanguageSwitcherCompact, Submenu, SubmenuCompact } from '$lib/components';
	// @ts-ignore - LL might not be available if i18n library not installed
	import { LL } from '../../../i18n/i18n-svelte';
	import { t, getAvailableLocalesWithNames, getLocale, applyLocale } from '$lib/helpers/i18n';
	import {
		walletConnected,
		walletAddress,
		autoLogin,
		connectWallet,
		disconnectWallet
	} from '$lib/helpers/auth/web3';

	const {
		logo,
		items = [],
		orientation = 'horizontal',
		style = 'blur',
		iconExternal,
		leftItemsPosition = 'left',
		hideOnScroll = false
	} = __SITE_CONFIG__?.themeConfig?.navbar || {};
	const { disableSwitch, defaultMode, respectPrefersColorScheme } =
		__SITE_CONFIG__?.themeConfig?.colorMode || {};
	const { enabled: authEnabled, strategy: authStrategy, title: authTitle, icon: authIcon, className: authClassName } = __SITE_CONFIG__?.auth || {};

	let isOpen = $state(false);
	let dropdownOpen = $state(false);
	let theme = $state(respectPrefersColorScheme
		? 'system'
		: (defaultMode ?? 'light'));

	// Scroll hide functionality
	let isScrollingDown = $state(false);
	let lastScrollY = $state(0);
	let headerVisible = $state(true);
	let initialLoad = $state(true);

	// Language submenu state
	let availableLocales: Array<{ code: string; name: string }> = $state([]);
	let currentLocale = $state('en');


	// Define the system theme change handler
	const handleSystemThemeChange = (e: MediaQueryListEvent) => {
		if (theme === 'system') {
			document.documentElement.classList.toggle('dark', e.matches);
		}
	};

	const menuItems = writable([{ label: 'common.logout', action: () => disconnectWallet({
		// @ts-expect-error - LL types may not include helpers
		corePassDisconnected: $LL.helpers.wallet.corePassDisconnected() || 'CorePass disconnected.'
	}) }]);

	const handleSelect = (event: CustomEvent<{ label: string; action?: () => void }>) => {
		if (event.detail.action) {
			event.detail.action();
		}
	};


	const selectLanguage = async (localeCode: string) => {
		currentLocale = localeCode;
		await applyLocale(localeCode);
		isOpen = false;
		if (browser) {
			document.body.style.overflow = 'auto';
		}
	};

	const getCurrentLanguageName = () => {
		const locale = availableLocales.find(l => l.code === currentLocale);
		return locale?.name || currentLocale.toUpperCase();
	};

	const toggleMenu = (event?: Event) => {
		if (event) {
			event.stopPropagation();
		}
		isOpen = !isOpen;
		if (browser) {
			document.body.style.overflow = isOpen ? 'hidden' : 'auto';
		}
	};

	const closeMenu = () => {
		isOpen = false;
		if (browser) {
			document.body.style.overflow = 'auto';
		}
	};

	const handleClickOutside = (event: MouseEvent) => {
		const menuElement = document.getElementById('dropdown-menu');
		const hamburgerButton = document.getElementById('hamburger-button');
		if (
			menuElement &&
			!menuElement.contains(event.target as Node) &&
			hamburgerButton &&
			!hamburgerButton.contains(event.target as Node)
		) {
			closeMenu();
		}
	};

	const handleScroll = () => {
		if (!hideOnScroll || !browser) return;

		const currentScrollY = window.scrollY;
		const wasVisible = headerVisible;

		// Determine scroll direction
		isScrollingDown = currentScrollY > lastScrollY;

		// Only hide if scrolled down more than 100px
		if (currentScrollY > 100) {
			if (currentScrollY > lastScrollY && currentScrollY - lastScrollY > 5) {
				// Scrolling down - hide menu
				headerVisible = false;
			} else if (currentScrollY < lastScrollY && lastScrollY - currentScrollY > 5) {
				// Scrolling up - show menu
				headerVisible = true;
			}
		} else {
			// Always show when near top
			headerVisible = true;
		}

		// Dispatch event if visibility changed
		if (wasVisible !== headerVisible) {
			const event = new CustomEvent('navHiddenChange', {
				detail: { isHidden: !headerVisible }
			});
			document.dispatchEvent(event);
		}

		lastScrollY = currentScrollY;
	};

	const rotateTheme = () => {
		if (!respectPrefersColorScheme) {
			// System theme detection is disabled, just toggle between light/dark
			theme = theme === 'light' ? 'dark' : 'light';
		} else {
			// System theme detection is enabled, rotate through: system -> light -> dark -> system
			if (theme === 'system') {
				theme = 'light';
			} else if (theme === 'light') {
				theme = 'dark';
			} else {
				theme = 'system';
			}
		}

		applyTheme();
	};

	const applyTheme = () => {
		if (browser) {
			if (theme === 'system') {
				// Apply system theme
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
				document.documentElement.classList.toggle('dark', prefersDark);
				localStorage.removeItem('theme');
			} else {
				// Apply manual theme
				const isDark = theme === 'dark';
				document.documentElement.classList.toggle('dark', isDark);
				localStorage.setItem('theme', theme);
			}
		}
	};

	const manualConnect = () => {
		if (authEnabled && browser && authStrategy === 'web3') connectWallet(true, {
			// @ts-expect-error - LL types may not include helpers
			corePassNotConfigured: $LL.helpers.wallet.corePassNotConfigured(),
			// @ts-expect-error - LL types may not include helpers
			corePassNotInstalled: $LL.helpers.wallet.corePassNotInstalled(),
			// @ts-expect-error - LL types may not include helpers
			corePassCannotConnect: $LL.helpers.wallet.corePassCannotConnect()
		});
	};

	onMount(() => {
		// Initialize language settings
		availableLocales = getAvailableLocalesWithNames();
		currentLocale = getLocale();

		if (authEnabled && browser && authStrategy === 'web3') {
			autoLogin();
		}

		if (!browser) return;

		// Initialize scroll state
		lastScrollY = window.scrollY;
		initialLoad = false;

		// Listen for the custom event from ActionsDropdown
		document.addEventListener('update:open', ((e: CustomEvent) => {
			dropdownOpen = e.detail;
		}) as EventListener);

		// Initialize theme based on configuration and user preferences
		if (respectPrefersColorScheme) {
			const storedTheme = localStorage.getItem('theme') as string | null;
			if (storedTheme === 'light' || storedTheme === 'dark') {
				// User has manually selected a theme
				theme = storedTheme;
			} else {
				// No manual selection, use system theme
				theme = 'system';
			}
		} else {
			// Respect system preference is disabled, use stored theme or default
			const storedTheme = localStorage.getItem('theme') as string | null;
			if (storedTheme === 'light' || storedTheme === 'dark') {
				theme = storedTheme;
			} else {
				theme = defaultMode || 'light';
			}
		}

		applyTheme();

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		mediaQuery.addEventListener('change', handleSystemThemeChange);

		document.addEventListener('click', handleClickOutside);

		// Add scroll event listener for hideOnScroll functionality
		if (hideOnScroll) {
			window.addEventListener('scroll', handleScroll, { passive: true });
		}

	});

	onDestroy(() => {
		if (browser) {
			document.removeEventListener('click', handleClickOutside);
			const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
			mediaQuery.removeEventListener('change', handleSystemThemeChange);

			// Remove scroll event listener
			if (hideOnScroll) {
				window.removeEventListener('scroll', handleScroll);
			}

			// Remove custom event listener
			document.removeEventListener('update:open', ((e: CustomEvent) => {
				dropdownOpen = e.detail;
			}) as EventListener);

			document.body.style.overflow = 'auto';
		}
	});
</script>

<header
	class={`fixed top-8 left-0 right-0 z-50 w-full flex justify-center lg:px-8 navigation ${orientation === 'vertical' ? 'vertical lg:mr-4' : 'horizontal'} transition-opacity duration-300 ease-in-out ${!headerVisible && hideOnScroll ? 'opacity-0' : 'opacity-100'}`}
>
	<div class={`nav-container container w-full flex items-center lg:mx-3 p-3 lg:rounded-xl relative z-50 ${style === 'transparent' ? 'transparent' : style === 'blur' ? 'bg-slate-900/80 backdrop-blur-md border border-slate-700/50' : style === 'auto' ? 'bg-slate-900/90 border border-slate-700/50 dark:bg-slate-200/90 dark:border dark:border-slate-400/50' : 'bg-slate-900/90 border border-slate-700/50'} lg:mt-6 ${orientation === 'vertical' ? 'lg:flex-col lg:max-w-[300px]' : ''}`} style={style === 'blur' ? 'backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);' : ''}>
		<div class={`w-full flex items-center desktop-menu min-w-0 min-h-12 ${orientation === 'vertical' ? 'lg:flex-col lg:gap-4 lg:pb-6' : ''}`}>
			{#if logo}
				<a href="/" class={`flex items-center flex-shrink-0 ${orientation === 'vertical' ? 'lg:mb-6' : ''}`}>
					<img
						src={style === 'auto' && theme === 'dark' && logo.srcDark ? logo.srcDark : style === 'transparent' && theme === 'light' && logo.srcDark ? logo.srcDark : logo.src}
						alt={logo.alt || __SITE_CONFIG__.title}
						class="h-6"
					/>
					{#if logo.appendTitle}
						<h1 class="text-2xl font-bold ml-2 {style === 'auto' ? 'text-white hover:text-slate-300 dark:text-slate-900 dark:hover:text-slate-600' : style === 'transparent' ? 'text-slate-900 hover:text-slate-600 dark:text-white dark:hover:text-slate-300' : 'text-white hover:text-slate-300'}">{__SITE_CONFIG__.title.endsWith(' ₡ore') ? __SITE_CONFIG__.title.slice(0, -5) : __SITE_CONFIG__.title}</h1>
					{/if}
				</a>
			{:else if __SITE_CONFIG__?.title}
				<a href="/" class={`flex items-center flex-shrink-0 ${orientation === 'vertical' ? 'lg:mb-6' : ''}`}>
					<h1 class="text-2xl font-bold {style === 'auto' ? 'text-white hover:text-slate-300 dark:text-slate-900 dark:hover:text-slate-600' : style === 'transparent' ? 'text-slate-900 hover:text-slate-600 dark:text-white dark:hover:text-slate-300' : 'text-white hover:text-slate-300'}">{__SITE_CONFIG__.title.endsWith(' ₡ore') ? __SITE_CONFIG__.title.slice(0, -5) : __SITE_CONFIG__.title}</h1>
				</a>
			{/if}
			<!-- Desktop Navigation - Hidden on sm and md, visible on lg+ -->
			<div class={`hidden lg:flex flex-1 mx-4 min-w-0 ${orientation === 'vertical' ? 'lg:flex-col' : 'scroll-smooth'} relative`}>
			<div class="flex-1 min-w-0">
					<ul class={`flex items-center ${orientation === 'vertical' ? 'gap-2 lg:flex-col lg:items-stretch w-full' : leftItemsPosition === 'center' ? 'gap-4 flex-wrap justify-center w-full' : 'gap-4 flex-wrap justify-start w-full'}`}>
						{#each items as { label, to, href, target, rel, position, icon, submenu }}
							{#if orientation === 'vertical' || position !== 'right'}
								<li class={`flex items-center flex-shrink-0 ${orientation === 'vertical' ? 'w-full justify-start' : ''}`}>
									{#if submenu}
										<!-- Submenu Item -->
										<Submenu
											title={label ? t(label, $LL) : ''}
											icon={icon}
											items={submenu.map(item => ({
												label: item.label ? t(item.label, $LL) : '',
												to: item.to,
												href: item.href,
												target: item.target,
												rel: item.rel,
												icon: item.icon,
												className: item.className,
												active: false
											}))}
											iconExternal={iconExternal}
											orientation={orientation}
											onback={() => {}}
											onselect={(item: any) => {
												if (item.href) {
													const rel = item.rel || 'noopener';
													window.open(item.href, item.target || '_self', rel);
												} else if (item.to) {
													window.location.href = item.to;
												}
											}}
											theme={style}
										/>
									{:else if to}
										<a href={to} class="group {style === 'auto' ? 'text-white! hover:text-slate-300! dark:text-slate-900! dark:hover:text-slate-600!' : style === 'transparent' ? 'text-slate-900! hover:text-slate-600! dark:text-white! dark:hover:text-slate-300!' : 'text-white! hover:text-slate-300!'} font-medium text-base flex items-center cursor-pointer transition-colors duration-200 {orientation === 'vertical' ? 'w-full justify-start px-4 py-2' : ''}">
											{#if icon}
												<Icon name={icon} className="h-5 w-5 {label ? 'mr-1.5' : ''}" />
											{/if}
											{#if label}
												<span class="whitespace-nowrap">{t(label, $LL)}</span>
											{/if}
										</a>
									{:else if href}
										<a
											{href}
											target={target ? target : undefined}
											rel={rel ? rel : 'noopener'}
											class="group {style === 'auto' ? 'text-white! hover:text-slate-300! dark:text-slate-900! dark:hover:text-slate-600!' : style === 'transparent' ? 'text-slate-900! hover:text-slate-600! dark:text-white! dark:hover:text-slate-300!' : 'text-white! hover:text-slate-300!'} font-medium text-base flex items-center cursor-pointer transition-colors duration-200 {orientation === 'vertical' ? 'w-full justify-start px-4 py-2' : ''}"
										>
											{#if icon}
												<Icon name={icon} className="h-5 w-5 {label ? 'mr-1.5' : ''}" />
											{/if}
											{#if label}
												<span class="whitespace-nowrap">{t(label, $LL)}</span>
											{/if}
											{#if typeof iconExternal === 'undefined' || iconExternal === true}
												<ArrowUpRight class="ml-1 h-4 w-4" />
											{/if}
										</a>
									{/if}
								</li>
							{/if}
						{/each}
					</ul>
				</div>
			</div>
			<div class={`hidden lg:flex ${orientation === 'vertical' ? 'flex-col mx-4' : 'items-center'} flex-shrink-0 relative`}>
				<!-- Right-positioned menu items -->
				<div class="flex items-center {orientation === 'horizontal' ? 'mx-4' : ''}">
					<ul class={`flex items-center ${orientation === 'vertical' ? 'gap-2 lg:flex-col lg:items-stretch w-full' : 'gap-4 flex-wrap'}`}>
						{#each items as { label, to, href, target, rel, position, icon, className, submenu }}
							{#if orientation !== 'vertical' && position === 'right'}
								<li class="flex items-center flex-shrink-0">
									{#if submenu}
										<!-- Submenu Item -->
										<Submenu
											title={label ? t(label, $LL) : ''}
											icon={icon}
											items={submenu.map(item => ({
												label: item.label ? t(item.label, $LL) : '',
												to: item.to,
												href: item.href,
												target: item.target,
												rel: item.rel,
												icon: item.icon,
												className: item.className,
												active: false
											}))}
											iconExternal={iconExternal}
											orientation={orientation}
											onback={() => {}}
											onselect={(item: any) => {
												if (item.href) {
													const rel = item.rel || 'noopener';
													window.open(item.href, item.target || '_self', rel);
												} else if (item.to) {
													window.location.href = item.to;
												}
											}}
											theme={style}
										/>
									{:else if to}
										<a href={to} class="group {style === 'auto' ? 'text-white! hover:text-slate-300! dark:text-slate-900! dark:hover:text-slate-600!' : style === 'transparent' ? 'text-slate-900! hover:text-slate-600! dark:text-white! dark:hover:text-slate-300!' : 'text-white! hover:text-slate-300!'} font-medium text-base flex items-center cursor-pointer transition-colors duration-200 {className}">
											{#if icon}
												<Icon name={icon} className="h-5 w-5 {label ? 'mr-1.5' : ''}" />
											{/if}
											{#if label}
												<span class="whitespace-nowrap">{t(label, $LL)}</span>
											{/if}
										</a>
									{:else if href}
										<a
											{href}
											target={target ? target : undefined}
											rel={rel ? rel : 'noopener'}
											class="group {style === 'auto' ? 'text-white! hover:text-slate-300! dark:text-slate-900! dark:hover:text-slate-600!' : style === 'transparent' ? 'text-slate-900! hover:text-slate-600! dark:text-white! dark:hover:text-slate-300!' : 'text-white! hover:text-slate-300!'} font-medium text-base flex items-center cursor-pointer transition-colors duration-200 {className}"
										>
											{#if icon}
												<Icon name={icon} className="h-5 w-5 {label ? 'mr-1.5' : ''}" />
											{/if}
											{#if label}
												<span class="whitespace-nowrap">{t(label, $LL)}</span>
											{/if}
											{#if typeof iconExternal === 'undefined' || iconExternal === true}
												<ArrowUpRight class="ml-1 h-4 w-4" />
											{/if}
										</a>
									{/if}
								</li>
							{/if}
						{/each}
					</ul>
				</div>
				<div class={`flex items-center ${orientation === 'vertical' ? 'gap-2 flex-col mt-4 w-full' : 'gap-2 whitespace-nowrap'}`}>
					<!-- Auth -->
					{#if authEnabled && $walletAddress}
						<ActionsDropdown
							title={$walletAddress}
							open={dropdownOpen}
							items={$menuItems}
							position="right"
							{iconExternal}
							{orientation}
							onChange={handleSelect}
						/>
					{:else if authEnabled}
						<button onclick={manualConnect} class="flex items-center transition-colors duration-200 border rounded-full px-4 py-2 justify-center {style === 'auto' ? 'text-white border-white hover:text-slate-300 dark:text-slate-900 dark:border-slate-900 dark:hover:text-slate-600' : style === 'transparent' ? 'text-slate-900 border-slate-900 hover:text-slate-600 dark:text-white dark:border-white dark:hover:text-slate-300' : 'text-white border-white hover:text-slate-300'} {orientation === 'vertical' ? 'w-full' : ''} {__SITE_CONFIG__?.auth?.className || ''}">
							<span class="flex items-center font-medium">
								<Icon name={t(__SITE_CONFIG__?.auth?.icon || 'login', $LL)} className="h-5 w-5 mr-1.5" />
								<span>{t(__SITE_CONFIG__?.auth?.title || 'Connect', $LL)}</span>
							</span>
						</button>
					{/if}
					<!-- Language Switcher -->
					{#if __SITE_CONFIG__?.language?.enabled}
						<div class="{orientation === 'vertical' ? 'w-full flex justify-center' : ''}">
							<LanguageSwitcher
								currentLocale={page.data.locale || __SITE_CONFIG__?.language?.defaultLocale || 'en'}
								availableLocales={(__SITE_CONFIG__?.language?.availableLocales || [{ code: 'en', name: 'English' }]).map(locale => ({
									code: locale.code,
									name: locale.name || locale.code.toUpperCase()
								}))}
								defaultLocale={__SITE_CONFIG__?.language?.defaultLocale || 'en'}
								className={__SITE_CONFIG__?.language?.className || ''}
								{orientation}
								theme={style}
							/>
						</div>
					{/if}
					<!-- Theme Switcher -->
					{#if !disableSwitch}
						<button onclick={rotateTheme} class="{style === 'auto' ? 'bg-white/60 dark:bg-slate-700/60' : style === 'transparent' ? 'bg-slate-700/60 dark:bg-white/60' : 'bg-white/60'} rounded-full {orientation === 'vertical' ? 'w-full h-8 justify-center' : 'w-8 h-8 justify-center'} flex items-center hover:bg-gray/80 transition-colors duration-200">
							{#if theme === 'system'}
								<Eclipse class="w-4 h-4 {style === 'auto' ? 'text-slate-900 dark:text-white' : style === 'transparent' ? 'text-white dark:text-slate-900' : 'text-slate-900'}" />
							{:else if theme === 'dark'}
								<Moon class="w-4 h-4 {style === 'auto' ? 'text-slate-900 dark:text-white' : style === 'transparent' ? 'text-white dark:text-slate-900' : 'text-slate-900'}" />
							{:else}
								<Sun class="w-4 h-4 {style === 'auto' ? 'text-slate-900 dark:text-white' : style === 'transparent' ? 'text-white dark:text-slate-900' : 'text-slate-900'}" />
							{/if}
						</button>
					{/if}
				</div>
			</div>
		</div>
		<!-- Mobile/Tablet Hamburger Menu - Visible on sm and md, hidden on lg+ -->
		<div class="lg:hidden flex items-center relative z-60">
			<button
				id="hamburger-button"
				class="cursor-pointer focus:outline-hidden flex items-center relative z-60 transition-all duration-300"
				onclick={(e) => toggleMenu(e)}
			>
				<div class="relative w-8 h-8">
					<Menu
						class="w-8 h-8 text-white absolute transition-all duration-300 {isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}"
					/>
					<X
						class="w-8 h-8 text-white absolute transition-all duration-300 {isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-0'}"
					/>
				</div>
			</button>
		</div>
	</div>

	{#if isOpen}
		<nav
			id="dropdown-menu"
			class="fixed top-18 left-0 right-0 bottom-0 overflow-hidden lg:hidden bg-gray-800 z-50"
		>
			<div class="relative overflow-hidden h-full">
				<!-- Main Menu -->
				<div class={`transition-transform duration-300 h-full overflow-y-auto translate-x-0`}>
					<ul class={`flex flex-col text-xl`}>
				{#each items as { label, to, href, target, rel, icon, submenu }}
					<li class="flex justify-center border-b border-slate-600/30">
						{#if submenu}
							<!-- Submenu Item -->
							<SubmenuCompact
								title={label ? t(label, $LL) : ''}
								icon={icon}
								items={submenu.map(item => ({
									label: item.label ? t(item.label, $LL) : '',
									to: item.to,
									href: item.href,
									target: item.target,
									rel: item.rel,
									icon: item.icon,
									className: item.className,
									active: false
								}))}
								iconExternal={iconExternal}
								onback={() => {}}
								onselect={(item: any) => {
									if (item.href) {
										const rel = item.rel || 'noopener';
										window.open(item.href, item.target || '_self', rel);
									} else if (item.to) {
										window.location.href = item.to;
									}
									closeMenu();
								}}
							/>
						{:else if to}
							<a href={to} onclick={closeMenu} class="flex items-center justify-center w-full text-center text-white! hover:text-indigo-400! transition-colors duration-200 py-8 px-4">
								{#if icon}
									<Icon name={icon} className="h-5 w-5 {label ? 'mr-1.5' : ''}" />
								{/if}
								{#if label}
									<span class="whitespace-nowrap">{t(label, $LL)}</span>
								{/if}
							</a>
						{:else if href}
							<a
								{href}
								target={target ? target : undefined}
								rel={rel ? rel : 'noopener'}
								onclick={closeMenu}
								class="flex items-center justify-center w-full text-center text-white! hover:text-indigo-400! transition-colors duration-200 py-8 px-4"
							>
								{#if icon}
									<Icon name={icon} className="h-5 w-5 {label ? 'mr-1.5' : ''}" />
								{/if}
								{#if label}
									<span class="whitespace-nowrap">{t(label, $LL)}</span>
								{/if}
								{#if typeof iconExternal === 'undefined' || iconExternal === true}
									<ArrowUpRight class="ml-1 h-4 w-4" />
								{/if}
							</a>
						{/if}
					</li>
				{/each}

				{#if authEnabled && $walletAddress}
					<li class="flex justify-center w-full border-b border-slate-600/30">
						<ActionsDropdown
							title={$walletAddress}
							open={dropdownOpen}
							items={$menuItems}
							position="left"
							isSmall={true}
							{iconExternal}
							theme={style}
							onChange={handleSelect}
							className="w-full py-8"
						/>
					</li>
				{:else if authEnabled}
					<li class="flex justify-center w-full border-b border-slate-600/30">
						<button onclick={() => { manualConnect(); closeMenu(); }} class="bg-indigo-600 hover:bg-indigo-700 flex items-center justify-center px-4 py-8 transition-colors duration-200 w-full border border-indigo-400 hover:border-indigo-300 {__SITE_CONFIG__?.auth?.className || ''}">
							<span class="flex gap-1.5 items-center font-medium text-xl text-white">
								<Icon name={t(__SITE_CONFIG__?.auth?.icon || 'login', $LL)} className="h-5 w-5" />
								<span class="text-white">{t(__SITE_CONFIG__?.auth?.title || 'Connect', $LL)}</span>
							</span>
						</button>
					</li>
				{/if}

				<!-- Language Switcher Item -->
				{#if __SITE_CONFIG__?.language?.enabled}
					<li class="flex justify-center w-full border-b border-slate-600/30">
						<LanguageSwitcherCompact
							title={getCurrentLanguageName()}
							icon={__SITE_CONFIG__?.language?.icon || 'languages'}
							items={availableLocales.map(locale => ({
								id: locale.code,
								label: locale.name,
								active: locale.code === currentLocale
							}))}
							onback={() => {}}
							onselect={(item: { id: string }) => selectLanguage(item.id)}
						/>
					</li>
				{/if}
					</ul>
				</div>

			</div>
		</nav>
	{/if}
</header>
