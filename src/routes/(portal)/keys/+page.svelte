<script lang="ts">
	const keys = ['gpg'];
</script>

<div class="max-w-4xl mx-auto p-6">
	<h1 class="text-3xl font-bold mb-4">Key Registry</h1>
	<p class="mb-4">
		Welcome to the Key Registry. Here you can find all types of keys used by MOTA.
	</p>

	<h2 class="text-xl font-bold mb-2">Public Key Types</h2>
	<ul class="space-y-2 list-disc list-inside">
		{#each keys as type}
			<li>
				<a href="/keys/{type}" class="text-blue-600 hover:text-blue-800 hover:underline">
					{type.toUpperCase()}
				</a>
			</li>
		{/each}
	</ul>
</div>
