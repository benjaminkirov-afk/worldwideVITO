<script>
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import testimonials from '$lib/data/testimonials.json';

	// ── Props ────────────────────────────────────────────────────
	export let data;
	const projects = data?.projects || [];

	// ── Visibility flags ─────────────────────────────────────────
	let showLogo         = false;
	let showAbout        = false;
	let showProjects     = false;
	let showTestimonials = false;

	// ── Section refs ─────────────────────────────────────────────
	let aboutSection;
	let projectsSection;
	let testimonialsSection;

	// ── State ────────────────────────────────────────────────────
	let isMobile = false;
	$: visibleProjects = isMobile ? projects.slice(0, 3) : projects;

	// ── Helpers ──────────────────────────────────────────────────
	function debounce(fn, delay) {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => fn(...args), delay);
		};
	}

	function updateIsMobile() {
		if (typeof window === 'undefined') return;
		isMobile = window.innerWidth < 768;
	}

	const debouncedUpdateIsMobile = debounce(updateIsMobile, 100);

	function setupObserver(el, onIntersect, threshold = 0.2) {
		if (!el) return null;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						onIntersect();
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold }
		);
		observer.observe(el);
		return observer;
	}

	// ── Lifecycle ────────────────────────────────────────────────
	onMount(async () => {
		showLogo = true;
		updateIsMobile();
		window.addEventListener('resize', debouncedUpdateIsMobile);

		await tick();

		const observers = [
			setupObserver(aboutSection,        () => (showAbout = true)),
			setupObserver(projectsSection,     () => (showProjects = true)),
			setupObserver(testimonialsSection, () => (showTestimonials = true), 0.1),
		];

		return () => {
			window.removeEventListener('resize', debouncedUpdateIsMobile);
			observers.forEach((obs) => obs?.disconnect());
		};
	});

	// ── Services data ─────────────────────────────────────────────
	const topCards = [
		{
			img: 'cards/card1.png',
			alt: 'Full-Cycle Event Production',
			title: 'Full-Cycle Event Production',
			items: ['Concept → flawless execution', 'Premium AV, lighting & stage design', 'Immersive theming & décor'],
			icon: `<rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>`
		},
		{
			img: 'cards/card2.png',
			alt: 'Corporate & Private Events',
			title: 'Corporate & Private Events',
			items: ['Conferences & product launches', 'Incentive trips & team-building', 'Gala dinners & private celebrations'],
			icon: `<rect x="4" y="4" width="16" height="16" rx="2"/><circle cx="12" cy="10" r="3"/><path d="M8 18h8M12 13v5"/>`
		},
		{
			img: 'cards/card3.png',
			alt: 'Cross-Cultural & MICE',
			title: 'Cross-Cultural & MICE',
			items: ['Russia ↔ India delegate support', 'Full logistics & hospitality', 'Cultural bridging & VIP handling'],
			icon: `<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2v20"/>`
		}
	];

	const bottomCards = [
		{
			img: 'cards/card4.png',
			alt: 'VIP & Concierge',
			title: 'VIP & Concierge',
			items: ['Ultra-premium guest experience', 'Private transfers & logistics', 'Exclusive cultural immersions'],
			icon: `<path d="M12 2l3 7h7l-5.5 4.2L18 21l-6-4-6 4 1.5-7.8L2 9h7z"/>`
		},
		{
			img: 'cards/card5.png',
			alt: 'Creative Direction & Art',
			title: 'Creative Direction & Art',
			items: ['Artist & talent curation', 'Concept & visual storytelling', 'Bespoke entertainment programs'],
			icon: `<circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"/>`
		}
	];
</script>

<!-- ── Hero ──────────────────────────────────────────────────────── -->
<section
	id="HeroSection"
	class="relative flex h-screen min-h-[560px] w-full items-center justify-center overflow-hidden"
>
	<div
		class="absolute inset-0 bg-cover bg-center"
		style="background-image: url('images/hero.png');"
	></div>
	<div class="absolute inset-0 bg-black/75"></div>

	<div class="relative z-10 flex flex-col items-center justify-center px-4 text-center">
		{#if showLogo}
			<img
				src="/images/Logotype.png"
				alt="VITO EVENTS"
				loading="lazy"
				class="w-36 drop-shadow-lg sm:w-52 md:w-64 lg:w-72 xl:w-80"
				in:fade={{ duration: 800 }}
				on:error={() => console.warn('Failed to load logo')}
			/>
		{/if}
	</div>
</section>

<!-- ── About ─────────────────────────────────────────────────────── -->
<section
	bind:this={aboutSection}
	id="AboutUsSection"
	class="flex w-full flex-col items-center bg-white px-6 py-16
	       sm:py-20 md:py-24 lg:py-28 xl:py-36"
>
	{#if showAbout}
		<div class="mx-auto flex w-full max-w-6xl flex-col items-center gap-10
		            md:flex-row md:items-center md:gap-x-12 lg:gap-x-16 xl:gap-x-24">

			<!-- Photo -->
			<div
				class="flex w-full justify-center md:w-5/12 lg:w-2/5"
				in:fly={{ x: -50, duration: 900, delay: 100 }}
			>
				<img
					src="/images/event.jpg"
					alt="Vito Events"
					loading="lazy"
					class="h-64 w-64 rounded-2xl object-cover shadow-lg transition-all duration-300
					       hover:scale-[1.02] hover:shadow-xl
					       sm:h-80 sm:w-80 md:h-80 md:w-80 lg:h-96 lg:w-96 xl:h-[28rem] xl:w-[28rem]"
					on:error={() => console.warn('Failed to load about image')}
				/>
			</div>

			<!-- Text -->
			<div
				class="flex w-full flex-col items-start md:w-7/12 lg:w-3/5"
				in:fly={{ x: 50, duration: 900, delay: 250 }}
			>
				<h2 class="mb-4 text-2xl font-semibold leading-tight text-[#252728]
				           sm:mb-6 sm:text-3xl lg:text-4xl xl:text-5xl">
					Global Experience
					<br />
					<span class="text-[#eb5b25]">Local Soul</span>
				</h2>
				<p class="max-w-lg text-sm leading-relaxed text-[#616060]
				          sm:text-base lg:text-lg xl:max-w-xl xl:text-xl">
					We don't just organize events — we create unforgettable experiences. With decades of
					expertise, we deliver precision, passion, and excellence in every detail: from project
					management and production to premium client service. We put our heart into every project.
				</p>
				<p class="mt-4 max-w-lg text-sm leading-relaxed text-[#616060]
				          sm:text-base lg:text-lg xl:max-w-xl xl:text-xl">
					Now, we're bringing this passion to India. Our new branch in New Delhi marks an exciting
					new chapter — sharing our expertise with international and local brands. We help you tell
					your story, connect across cultures, and impress with world-class quality. If you're
					looking for more than an organizer — a true partner who cares — we're here to make it happen.
				</p>
			</div>

		</div>
	{/if}
</section>

<!-- ── Services ──────────────────────────────────────────────────── -->
<section class="bg-white py-16 sm:py-20 md:py-24 xl:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8 xl:px-12">

		<h2 class="mb-12 text-center text-2xl font-medium text-[#252728]
		           sm:text-3xl md:mb-16 lg:text-4xl xl:mb-20 xl:text-5xl">
			Our Services
		</h2>

		<!-- Top 3 cards -->
		<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-10">
			{#each topCards as card}
				<div class="group overflow-hidden rounded-2xl border border-gray-100/60 bg-white shadow-md
				            transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
					<div class="relative h-52 overflow-hidden sm:h-56 md:h-64 xl:h-72">
						<img
							src={card.img}
							alt={card.alt}
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent
						            opacity-60 transition-opacity duration-500 group-hover:opacity-40"></div>
						<div class="absolute inset-0 flex items-center justify-center">
							<div class="rounded-full border border-white/20 bg-white/10 p-4 backdrop-blur-sm
							            transition-all duration-500 group-hover:scale-110 group-hover:bg-[#EB5B25]/80
							            xl:p-5">
								<svg class="h-9 w-9 text-white xl:h-11 xl:w-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
									{@html card.icon}
								</svg>
							</div>
						</div>
					</div>
					<div class="p-6 xl:p-8">
						<h3 class="mb-3 text-lg font-semibold text-[#252728] transition-colors duration-300
						           group-hover:text-[#EB5B25] sm:text-xl xl:text-2xl">
							{card.title}
						</h3>
						<ul class="space-y-2 text-sm leading-relaxed text-[#616060] xl:text-base xl:space-y-3">
							{#each card.items as item}
								<li>• {item}</li>
							{/each}
						</ul>
					</div>
				</div>
			{/each}
		</div>

		<!-- Bottom 2 cards — centered -->
		<div class="mt-6 flex justify-center lg:mt-8 xl:mt-10">
			<div class="grid w-full grid-cols-1 gap-6 sm:max-w-2xl sm:grid-cols-2 lg:gap-8 xl:max-w-4xl xl:gap-10">
				{#each bottomCards as card}
					<div class="group overflow-hidden rounded-2xl border border-gray-100/60 bg-white shadow-md
					            transition-all duration-500 hover:-translate-y-2 hover:shadow-xl">
						<div class="relative h-52 overflow-hidden sm:h-56 md:h-64 xl:h-72">
							<img
								src={card.img}
								alt={card.alt}
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent
							            opacity-60 transition-opacity duration-500 group-hover:opacity-40"></div>
							<div class="absolute inset-0 flex items-center justify-center">
								<div class="rounded-full border border-white/20 bg-white/10 p-4 backdrop-blur-sm
								            transition-all duration-500 group-hover:scale-110 group-hover:bg-[#EB5B25]/80
								            xl:p-5">
									<svg class="h-9 w-9 text-white xl:h-11 xl:w-11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
										{@html card.icon}
									</svg>
								</div>
							</div>
						</div>
						<div class="p-6 xl:p-8">
							<h3 class="mb-3 text-lg font-semibold text-[#252728] transition-colors duration-300
							           group-hover:text-[#EB5B25] sm:text-xl xl:text-2xl">
								{card.title}
							</h3>
							<ul class="space-y-2 text-sm leading-relaxed text-[#616060] xl:text-base xl:space-y-3">
								{#each card.items as item}
									<li>• {item}</li>
								{/each}
							</ul>
						</div>
					</div>
				{/each}
			</div>
		</div>

	</div>
</section>

<!-- ── Projects ───────────────────────────────────────────────────── -->
<section bind:this={projectsSection} class="bg-[#0E1113] px-6 py-16 sm:py-20 md:py-24 xl:py-32">
	{#if showProjects}
		<div in:fly={{ y: 40, duration: 800 }}>

			<h2 class="mb-10 text-center text-2xl font-medium text-white
			           sm:text-3xl md:mb-14 lg:text-4xl xl:mb-16 xl:text-5xl">
				Our Projects
			</h2>

			<div class="mx-auto max-w-7xl xl:max-w-[90rem]">
				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:gap-7">
					{#each visibleProjects as project}
						
							<a href={`/projects/${project.slug}`}
							class="group relative block overflow-hidden rounded-xl shadow-md
							       transition-shadow duration-300 hover:shadow-2xl"
						>
							<img
								src={project.src}
								alt={project.alt}
								loading="lazy"
								class="h-64 w-full object-cover transition-transform duration-500
								       group-hover:scale-105 sm:h-72 md:h-80 xl:h-96"
							/>
							<div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
							<div class="absolute bottom-4 left-5 xl:bottom-6 xl:left-7">
								<p class="text-xs font-normal uppercase tracking-widest text-white/70 xl:text-sm">
									{project.type}
								</p>
								<p class="mt-0.5 text-base font-medium text-white sm:text-lg xl:text-xl">
									{project.title}
								</p>
							</div>
						</a>
					{/each}
				</div>

				<div class="mt-10 flex justify-center xl:mt-14">
					
						<a href="/projects"
						class="rounded-lg border border-white/60 px-8 py-3 text-sm font-medium text-white
						       transition-all duration-300 hover:bg-white hover:text-[#0E1113]
						       sm:text-base xl:px-10 xl:py-4 xl:text-lg"
					>
						All projects
					</a>
				</div>
			</div>

		</div>
	{/if}
</section>

<!-- ── Testimonials ───────────────────────────────────────────────── -->
<section
	bind:this={testimonialsSection}
	id="TestimonialsSection"
	class="bg-white px-6 py-16 sm:py-20 md:py-24 xl:py-32"
>
	{#if showTestimonials}
		<div in:fly={{ y: 40, duration: 800 }}>

			<h2 class="mb-3 text-center text-2xl font-medium text-[#0E1113]
			           sm:text-3xl lg:text-4xl xl:text-5xl">
				Clients Testimonials
			</h2>
			<div class="mx-auto mb-12 h-0.5 w-16 rounded-full bg-[#EB5B25]
			            sm:mb-14 sm:w-20 xl:mb-16 xl:w-24"></div>

			<div class="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3
			            xl:max-w-[90rem] xl:gap-8">
				{#each testimonials as t, i}
					<div
						in:fly={{ y: 30, duration: 500, delay: i * 80 }}
						class="flex flex-col rounded-xl border border-gray-100 bg-white p-5 sm:p-6 xl:p-8
						       shadow-[0_2px_16px_rgba(0,0,0,0.06)] transition-shadow duration-300
						       hover:shadow-[0_6px_24px_rgba(235,91,37,0.12)]"
					>
						<svg class="mb-3 h-7 w-7 text-[#EB5B25] opacity-30 xl:h-9 xl:w-9" viewBox="0 0 24 24" fill="currentColor">
							<path d="M7.17 17c.51 0 .98-.29 1.2-.74l1.42-2.84A1 1 0 0 0 9.5 12H7V7H2v5.5C2 15.54 4.46 17 7.17 17zm11 0c.51 0 .98-.29 1.2-.74l1.42-2.84A1 1 0 0 0 20.5 12H18V7h-5v5.5c0 3.04 2.46 4.5 5.17 4.5z"/>
						</svg>

						<p class="mb-5 flex-grow text-sm leading-relaxed text-gray-500 xl:text-base xl:leading-loose">
							{t.text}
						</p>

						<div class="mb-4 h-px bg-gray-100"></div>

						<div class="flex items-center gap-3">
							<div class="h-9 w-9 flex-shrink-0 overflow-hidden rounded-full border border-[#EB5B25]/25
							            xl:h-12 xl:w-12">
								{#if t.avatar}
									<img src={t.avatar} alt={t.name} class="h-full w-full object-cover" />
								{:else}
									<div class="flex h-full w-full items-center justify-center bg-[#EB5B25]/10 text-xs font-bold text-[#EB5B25] xl:text-sm">
										{t.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
									</div>
								{/if}
							</div>
							<div>
								<p class="text-sm font-semibold leading-tight text-[#0E1113] xl:text-base">{t.name}</p>
								<p class="mt-0.5 text-xs text-gray-400 xl:text-sm">{t.position}</p>
							</div>
						</div>
					</div>
				{/each}
			</div>

		</div>
	{/if}
</section>