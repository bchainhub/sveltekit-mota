<script lang="ts">
	import { tick } from 'svelte';

	let hovered = false;
	let tooltipPosition = { x: 0, y: 0 };
	let tooltipElement: HTMLDivElement;
	let transformStyle = '';
	let arrowPosition: 'top' | 'bottom' = 'bottom';

	// Optional styling props
	export let tooltipClass = 'px-3 py-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-sm rounded-lg shadow-xl border border-slate-200 dark:border-slate-600';
	export let arrowClass = 'border-t-white dark:border-t-slate-700';

	async function showTooltip(event: MouseEvent) {
		hovered = true;
		await tick(); // Wait for DOM to update
		updateTooltipPosition(event);
	}

	function updateTooltipPosition(event: MouseEvent) {
		if (!tooltipElement) {
			// Fallback positioning if element not yet available
			tooltipPosition = { x: event.clientX, y: event.clientY };
			transformStyle = 'translate(-50%, calc(-100% - 12px))';
			return;
		}

		const mouseX = event.clientX;
		const mouseY = event.clientY;

		// Get tooltip dimensions
		const tooltipRect = tooltipElement.getBoundingClientRect();
		const tooltipWidth = tooltipRect.width;
		const tooltipHeight = tooltipRect.height;

		// Viewport dimensions
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		// Calculate horizontal position (centered on cursor)
		let x = mouseX;
		let horizontalTransform = '-50%';

		// Check if tooltip would go off the left edge
		if (mouseX - tooltipWidth / 2 < 0) {
			x = tooltipWidth / 2 + 8; // 8px padding from edge
			horizontalTransform = '-50%';
		}
		// Check if tooltip would go off the right edge
		else if (mouseX + tooltipWidth / 2 > viewportWidth) {
			x = viewportWidth - tooltipWidth / 2 - 8;
			horizontalTransform = '-50%';
		}

		// Calculate vertical position (above cursor by default)
		const verticalSpacing = 20; // Spacing between cursor and tooltip
		let y = mouseY;
		let verticalTransform = `calc(-100% - ${verticalSpacing}px)`;
		arrowPosition = 'bottom';

		// Check if tooltip would go off the top edge
		if (mouseY - tooltipHeight - verticalSpacing < 0) {
			// Position below cursor instead
			y = mouseY;
			verticalTransform = `calc(100% + ${verticalSpacing}px)`;
			arrowPosition = 'top';
		}
		// Check if tooltip would go off the bottom edge when positioned below
		else if (mouseY + tooltipHeight + verticalSpacing > viewportHeight && mouseY - tooltipHeight - verticalSpacing >= 0) {
			// Keep it above
			y = mouseY;
			verticalTransform = `calc(-100% - ${verticalSpacing}px)`;
			arrowPosition = 'bottom';
		}

		tooltipPosition = { x, y };
		transformStyle = `translate(${horizontalTransform}, ${verticalTransform})`;
	}

	function hideTooltip() {
		hovered = false;
	}
</script>

<div class="relative inline-block">
	<div
		role="presentation"
		on:mouseenter={showTooltip}
		on:mouseleave={hideTooltip}
		on:mousemove={updateTooltipPosition}
		class="inline-block"
	>
		<slot />
	</div>

	{#if hovered}
		<div
			bind:this={tooltipElement}
			class="fixed z-50 {tooltipClass} pointer-events-none"
			style="left: {tooltipPosition.x}px; top: {tooltipPosition.y}px; transform: {transformStyle};"
		>
			<slot name="content">
				<!-- Default content slot -->
			</slot>
			<!-- Arrow pointing down or up based on position -->
			{#if arrowPosition === 'bottom'}
				<div
					class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent {arrowClass}"
				></div>
			{:else}
				<div
					class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-transparent border-b-white dark:border-b-slate-700"
				></div>
			{/if}
		</div>
	{/if}
</div>
