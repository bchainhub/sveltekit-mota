<script lang="ts">
	const keys = ['rastislav@onion.email'];
</script>

<div class="max-w-4xl mx-auto p-6">
	<h1 class="text-3xl font-bold mb-4">GPG Key Registry</h1>
	<p class="mb-4">
		Welcome to the GPG Key Registry. Here you can find all the GPG keys used by MOTA.
	</p>

	<h2 class="text-xl font-bold mb-2">Public Keys</h2>
	<ul class="space-y-2 list-disc list-inside">
		{#each keys as key}
			<li>
				<a href="/keys/gpg/{key}" class="text-blue-600 hover:text-blue-800 hover:underline">
					{key}
				</a>
			</li>
		{/each}
	</ul>
</div>
