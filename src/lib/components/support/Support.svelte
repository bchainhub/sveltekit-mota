<script lang="ts">
	import { Send, Sparkles } from 'lucide-svelte';
	import { LL } from '../../../i18n/i18n-svelte';
	const siteConfig = __SITE_CONFIG__;

	interface Props {
		mode?: 'ai' | 'ticket';
	}

	let { mode: initialMode = 'ai' }: Props = $props();

	type SupportMode = 'ai' | 'ticket';
	type Subject = string;

	const subjects: Subject[] = siteConfig?.support?.ai?.subjects || ["general"];

	let mode = $state<SupportMode>('ticket');
	let selectedSubject = $state<Subject>(subjects[0] || "general");
	let question = $state('');
	let aiResponse = $state<string | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);

	// Check if AI is enabled (using public flag, actual API key is server-side)
	const aiEnabled = $derived(siteConfig.support?.ai?.enabled);

	// Update mode and reset state
	function setMode(newMode: SupportMode) {
		mode = newMode;
		aiResponse = null;
		error = null;
	}

	// Sync initial mode from prop, but switch to ticket if AI is requested but not enabled
	$effect(() => {
		if (initialMode === 'ai' && aiEnabled) {
			mode = 'ai';
		} else {
			mode = 'ticket';
		}
	});

	async function handleSubmit() {
		if (mode === 'ai') {
			if (!question.trim()) {
				error = $LL.support.errors.pleaseEnterYourQuestion() || 'Please enter your question';
				return;
			}
			await askAI();
		} else {
			sendTicket();
		}
	}

	async function askAI() {
		if (!aiEnabled) {
			error = $LL.support.errors.aiServiceNotAvailable() || 'AI service is not available';
			return;
		}

		loading = true;
		error = null;

		try {
			const response = await fetch('/api/v1/support/ai', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					subject: selectedSubject,
					question: question
				})
			});

			const result = await response.json();

			if (result.status === 'success') {
				aiResponse = result.data.answer;
				question = ''; // Clear textarea after successful execution
			} else {
				error = result.message || $LL.support.errors.failedToGetAIResponse() || 'Failed to get AI response';
			}
		} catch (err) {
			error = err instanceof Error ? err.message : $LL.support.errors.anErrorOccurredWhileAskingAI() || 'An error occurred while asking AI';
		} finally {
			loading = false;
		}
	}

	function sendTicket() {
		const receiverEmail = siteConfig.support?.email;
		if (!receiverEmail) {
			error = $LL.support.errors.supportEmailNotConfigured() || 'Support email is not configured';
			return;
		}
		const emailSubject = encodeURIComponent(`Support: ${selectedSubject}`);
		const mailtoLink = `mailto:${receiverEmail}?subject=${emailSubject}`;
		window.location.href = mailtoLink;
	}
</script>

<section id="support" class="w-full py-16 md:py-8 lg:py-16">
	<div class="w-full mx-auto max-w-4xl px-4">
		<div class="mb-6 heading-component w-full flex flex-col items-center">
			<div
				class="text-slate-900 dark:text-white font-bold tracking-tight w-full text-center text-2xl lg:text-3xl xl:text-4xl leading-tight max-xl:text-2xl max-xl:leading-tight max-md:text-xl max-md:leading-tight max-sm:text-xl max-sm:leading-tight"
			>
				{$LL.support.support() || 'Support'}
			</div>
		</div>

		<div class="bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 space-y-6">
			<!-- Mode Selection (only show if AI is enabled) -->
			{#if aiEnabled}
				<div>
					<label for="mode" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						{$LL.support.supportType() || 'Support Type'}
					</label>
					<select
						id="mode"
						bind:value={mode}
						onchange={() => setMode(mode)}
						class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
					>
						<option value="ai">{$LL.support.askAI() || 'Ask AI'}</option>
						<option value="ticket">{$LL.support.createTicket()}</option>
					</select>
				</div>
			{/if}

			<!-- Subject Selection -->
			<div>
				<label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
					{$LL.support.subject()}
				</label>
				<select
					id="subject"
					bind:value={selectedSubject}
					class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-500"
				>
					{#each subjects as subject}
						{@const subjectKey = subject as keyof typeof $LL.support.subjects}
						{@const subjectLabel = $LL.support.subjects[subjectKey] || subject}
						<option value={subject}>
							{typeof subjectLabel === 'function' ? subjectLabel() : (subjectLabel || subject)}
						</option>
					{/each}
				</select>
			</div>

			<!-- AI Response (shown above textarea if available) -->
			{#if aiResponse}
				<div class="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
					<div class="flex items-start gap-3">
						<Sparkles class="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
						<div class="flex-1">
							<h3 class="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">{$LL.support.aiResponse() || 'AI Response'}</h3>
							<p class="text-sm text-blue-800 dark:text-blue-200 leading-relaxed whitespace-pre-wrap">
								{aiResponse}
							</p>
						</div>
					</div>
				</div>
			{/if}

			<!-- Question Textarea (only for AI mode) -->
			{#if mode === 'ai'}
				<div>
					<label for="question" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
						{#if aiResponse}
							{$LL.support.followUpQuestion() || 'Follow Up Question'}
						{:else}
							{$LL.support.question() || 'Question'}
						{/if}
					</label>
					<textarea
						id="question"
						bind:value={question}
						rows="6"
						placeholder="{$LL.support.askYourQuestion() || 'Ask your question…'}"
						class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
					></textarea>
				</div>
			{/if}

			<!-- Error Message -->
			{#if error}
				<div class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
					<p class="text-sm text-red-800 dark:text-red-200">{error}</p>
				</div>
			{/if}

			<!-- Submit Button -->
			<button
				type="button"
				onclick={handleSubmit}
				disabled={loading || (mode === 'ai' && (!question.trim() || !aiEnabled))}
				class="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 active:bg-yellow-700 px-8 py-3 text-center text-sm font-semibold text-gray-900 outline-none ring-yellow-300 transition duration-100 focus-visible:ring disabled:opacity-50 disabled:cursor-not-allowed md:text-base"
			>
				{#if loading}
					<span class="animate-spin">⏳</span>
					{$LL.support.processing() || 'Processing'}
				{:else if mode === 'ai'}
					<Sparkles class="w-5 h-5" />
					{$LL.support.askAI() || 'Ask AI'}
				{:else}
					<Send class="w-5 h-5" />
					{$LL.support.sendTicketByEmail() || 'Send Ticket by Email'}
				{/if}
			</button>
		</div>
	</div>
</section>
