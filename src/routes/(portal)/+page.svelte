<!-- +page.svelte — ultra-compact intro (MOTA Starter) -->
<div class="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
	<div class="bg-white overflow-hidden">
		<div class="px-4 py-5 sm:p-6">
			<h1 class="text-4xl font-bold text-center mb-6">MOTA – SvelteKit Starter</h1>

			<div class="mb-8">
				<h2 class="text-2xl font-semibold mb-2">Install</h2>
				<pre class="bg-gray-900 text-gray-100 text-sm rounded-md p-4 overflow-x-auto">
bash -c "$(curl -fsSL https://cdn.jsdelivr.net/gh/bchainhub/sveltekit-starter/sv-starter.sh)"</pre>
			</div>

			<div class="mb-8">
				<h2 class="text-2xl font-semibold mb-2">What it does</h2>
				<ul class="list-disc list-inside pl-4 space-y-1 text-gray-800">
					<li>Runs <code>sv create</code> and installs core deps.</li>
					<li>Optionally merges the MOTA template and reinstalls deps.</li>
					<li>Augments <code>.gitignore</code> (+logs, editors; optional lockfile ignores).</li>
					<li>Optional asset copy: <code>.editorconfig</code> (yes by default) and <code>.github</code> (no by default).</li>
					<li>License: CORE (default) or common SPDX; updates <code>package.json</code> license field.</li>
					<li>Single optional final commit; optional push (default no).</li>
					<li>Remove +page.svelte in main routes and create new in (portal) routes.</li>
				</ul>
			</div>

			<div class="mb-8">
				<h2 class="text-2xl font-semibold mb-2">You choose during setup</h2>
				<ul class="list-disc list-inside pl-4 space-y-1 text-gray-800">
					<li>Auth: None / <code>@auth/sveltekit</code> / <code>lucia</code></li>
					<li>Data layer: Prisma, Drizzle, Supabase, Neon, MongoDB, Redis, Postgres, Xata, etc.</li>
					<li>Assets: copy <code>.editorconfig</code> / <code>.github</code></li>
					<li>License: CORE / MIT / Apache-2.0 / GPL / … / None</li>
				</ul>
			</div>

			<div>
				<h2 class="text-2xl font-semibold mb-2">Next</h2>
				<ol class="list-decimal pl-5 space-y-1 text-gray-800">
					<li>Answer prompts (auth, DB, assets, license).</li>
					<li>Modify <code>vite.config.ts</code> to your needs.</li>
					<li>Update GPG keys or delete GPG keys directory.</li>
					<li>Open routes directory and modify routes to your needs.</li>
					<li>Modify or disable API located in <code>src/routes/api</code>.</li>
					<li>Start dev server: <code>npm run dev</code> (or <code>pnpm</code>/<code>yarn</code>/<code>bun</code>).</li>
				</ol>
			</div>
		</div>
	</div>
</div>
