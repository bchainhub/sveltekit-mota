<script lang="ts">
	import { Copy, Download, ArrowUpRight } from 'lucide-svelte';
	import { copyToClipboard, downloadGPGKey } from '$lib/helpers/keys';
	import { LL } from '../../../../../../i18n/i18n-svelte';

	const keyName = 'rastislav@onion.email';
	const keyId = '5B438A11';
	const keyServerLink =
		'https://keys.openpgp.org/vks/v1/by-fingerprint/F670A2D3626AB878A46D7AA8879FF4E05B438A11';
	const key = `-----BEGIN PGP PUBLIC KEY BLOCK-----

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
=uq7e
-----END PGP PUBLIC KEY BLOCK-----`;

	// Function to copy the GPG key to clipboard
	function copyKey() {
		copyToClipboard(
			key,
			$LL.helpers.keys.copiedToClipboard(),
			$LL.helpers.keys.failedToCopy()
		);
	}

	// Function to download the GPG key as a .asc file
	function downloadKey() {
		downloadGPGKey(key, keyName);
	}
</script>

<div class="max-w-4xl mx-auto p-6">
	<h1 class="text-xl md:text-3xl font-semibold mb-2">{$LL.common.keys.publicKeyFor({keyName: keyName})}</h1>

	{#if keyId}
		<div class="mb-4 text-sm text-gray-500">
			{$LL.common.keys.keyId({keyId: keyId})}
		</div>
	{/if}

	<div class="mb-6 flex flex-col sm:flex-row sm:flex-wrap gap-2">
		<button
			on:click={copyKey}
			class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			<Copy class="h-4 w-4 mr-2" />
			{$LL.common.keys.copyKey()}
		</button>

		<button
			on:click={downloadKey}
			class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			<Download class="h-4 w-4 mr-2" />
			{$LL.common.keys.downloadKey({keyName: keyName})}
		</button>

		{#if keyServerLink}
			<a
				href={keyServerLink}
				target="_blank"
				rel="noopener noreferrer"
				class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700! bg-white no-underline! hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
			>
				{$LL.common.keys.viewOnKeyServer()}
				<ArrowUpRight class="h-4 w-4 ml-1" />
			</a>
		{/if}
	</div>

	<div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
		<pre class="text-sm overflow-auto">{key}</pre>
	</div>
</div>
