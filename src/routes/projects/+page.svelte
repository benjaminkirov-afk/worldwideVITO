<script>
	import { onMount } from 'svelte';
	import { cubicOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	function fadeUp(node, { delay = 0, duration = 500 }) {
		return {
			delay,
			duration,
			css: (t) => `
				opacity: ${t};
				transform: translateY(${(1 - t) * 20}px);
			`,
			easing: cubicOut
		};
	}

	let projects = [];

	onMount(async () => {
		const WP_BASE_URL = 'https://admin.vitopro.ru';

		const res = await fetch(
			`${WP_BASE_URL}/wp-json/wp/v2/project?per_page=100&orderby=date&order=desc
`
		);

		const data = await res.json();

		projects = await Promise.all(
			data.map(async (p) => {
				let cover = null;
				if (p.acf.cover_image) {
					const coverRes = await fetch(`${WP_BASE_URL}/wp-json/wp/v2/media/${p.acf.cover_image}`);
					if (coverRes.ok) cover = await coverRes.json();
				}

				return {
					title: p.title.rendered,
					slug: p.slug,
					type: p.acf.type || '',
					image: cover?.source_url || '/placeholder.png',
					alt: cover?.alt_text || p.title.rendered
				};
			})
		);
	});
</script>

<section class="mx-auto max-w-6xl px-4 py-16 pb-6">
	<h2 class="mt-10 mb-2 text-center text-4xl font-medium text-white" in:fade={{ duration: 800 }}>
		Наши проекты
	</h2>
	<p class="mb-2 text-center font-light text-white" in:fade={{ duration: 800, delay: 200 }}>
		Каждая история — это решение конкретной задачи нашего клиента
	</p>
</section>

<section class="w-full px-4 pb-8">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
		{#each projects as project, i}
			<a
				href={`/projects/${project.slug}`}
				class="group relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-102"
				in:fadeUp={{ duration: 800, delay: i * 100 }}
			>
				<img
					src={project.image}
					alt={project.alt}
					class="h-100 w-full object-cover transition-transform duration-500 group-hover:scale-110"
					loading="lazy"
				/>
				<div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
				<div class="absolute bottom-4 left-4 text-white">
					<div class="text-base font-normal">{project.type}</div>
					<div class="text-lg font-medium md:text-xl">{project.title}</div>
				</div>
			</a>
		{/each}
	</div>
</section>
