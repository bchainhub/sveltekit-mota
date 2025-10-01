<div class="bg-white dark:bg-gray-900 dark:text-gray-100">
	<div class="container mx-auto space-y-16 px-4 py-16 lg:px-8 lg:py-32 xl:max-w-7xl"
	>
		<div class="text-center">
			<div class="mb-1 text-sm font-bold tracking-wider text-blue-600 uppercase dark:text-blue-500">
				MOTA – SvelteKit Starter
			</div>
			<h2 class="mb-4 text-4xl font-black text-black dark:text-white">
				Getting Started with Mota
			</h2>
			<div class="mx-auto text-xl leading-relaxed font-medium text-gray-700 lg:w-2/3 dark:text-gray-300 space-y-4">
				<div>
					<h2 class="text-2xl font-semibold mb-2">Install</h2>
					<pre class="bg-gray-900 text-gray-100 text-sm rounded-md p-4 overflow-x-auto">bash -c "$(curl -fsSL https://cdn.jsdelivr.net/gh/bchainhub/sveltekit-starter/sv-starter.sh)"</pre>
				</div>
				<div>
					<h2 class="text-2xl font-semibold mb-2">What it does</h2>
					<ul class="list-disc list-inside pl-4 space-y-1">
						<li>Runs <code>sv create</code> and installs core deps.</li>
						<li>Optionally merges the MOTA template and reinstalls deps.</li>
						<li>Augments <code>.gitignore</code> (+logs, editors; optional lockfile ignores).</li>
						<li>Optional asset copy: <code>.editorconfig</code> (yes by default) and <code>.github</code> (no by default).</li>
						<li>License: CORE (default) or common SPDX; updates <code>package.json</code> license field.</li>
						<li>Single optional final commit; optional push (default no).</li>
						<li>Remove +page.svelte in main routes and create new in (portal) routes.</li>
					</ul>
				</div>
				<div>
					<h2 class="text-2xl font-semibold mb-2">You choose during setup</h2>
					<ul class="list-disc list-inside pl-4 space-y-1">
						<li>Auth: None / <code>@auth/sveltekit</code> / <code>lucia</code></li>
						<li>Data layer: Prisma, Drizzle, Supabase, Neon, MongoDB, Redis, Postgres, Xata, etc.</li>
						<li>Translation: Typesafe I18n</li>
						<li>Assets: copy <code>.editorconfig</code> / <code>.github</code></li>
						<li>License: CORE / MIT / Apache-2.0 / GPL / … / None</li>
					</ul>
				</div>
				<div>
					<h2 class="text-2xl font-semibold mb-2">Next</h2>
					<ol class="list-decimal pl-5 space-y-1">
						<li>Answer prompts (auth, DB, assets, license).</li>
						<li>Modify <code>vite.config.ts</code> to your needs.</li>
						<li>Edit language configuration and files in <code>src/i18n</code> or clean language directory and references.</li>
						<li>Update GPG keys or delete GPG keys directory.</li>
						<li>Open routes directory and modify routes to your needs.</li>
						<li>Modify or disable API located in <code>src/routes/api</code>.</li>
						<li>Start dev server: <code>npm run dev</code> (or <code>pnpm</code>/<code>yarn</code>/<code>bun</code>).</li>
					</ol>
				</div>
			</div>
		</div>
	</div>
</div>
