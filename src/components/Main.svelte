<script>
	import { onMount, tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	let showLogo = false;
	let showAbout = false;
	let showLetters = false;
	let showProjects = false;
	let aboutSection;
	let lettersSection;
	let projectsSection;
	let expandedLetter = null;
	let isTransitioning = false;
	let isMobile = false;

	export let data;
	const projects = data?.projects || [];

	const letters = [
		'/images/letters/letter1.png',
		'/images/letters/letter2.png',
		'/images/letters/letter3.png',
		'/images/letters/letter4.png',
		'/images/letters/letter6.png'
	];
	const extendedLetters = [...letters, ...letters, ...letters];
	let current = letters.length;
	let interval;
	let slidesPerView = 3;
	let sliderContainer;
	let sliderEl;

	let startX = 0;
	let currentX = 0;
	let isDragging = false;
	const TRANSITION_DURATION = 500;
	let visibleProjects;

	function debounce(fn, delay) {
		let timeout;
		return (...args) => {
			clearTimeout(timeout);
			timeout = setTimeout(() => fn(...args), delay);
		};
	}

	$: visibleProjects = isMobile ? projects.slice(0, 3) : projects;

	function updateSlidesPerView() {
		if (typeof window === 'undefined') return;
		isMobile = window.innerWidth < 768;
		if (window.innerWidth < 640) slidesPerView = 1;
		else if (window.innerWidth < 1024) slidesPerView = 2;
		else slidesPerView = 3;
	}

	const debouncedUpdate = debounce(updateSlidesPerView, 100);

	function onPointerDown(e) {
		isDragging = true;
		startX = e.clientX || e.touches?.[0]?.clientX;
		e.preventDefault();
	}

	function onPointerMove(e) {
		if (!isDragging) return;
		currentX = e.clientX || e.touches?.[0]?.clientX;
	}

	function onPointerUp() {
		if (!isDragging) return;
		const diff = currentX - startX;
		const threshold = 50;

		if (Math.abs(diff) > threshold) {
			if (diff > 0) prev();
			else next();
		}

		isDragging = false;
		startX = 0;
		currentX = 0;
	}

	function prev() {
		if (isTransitioning) return;
		isTransitioning = true;
		current = (current - 1 + extendedLetters.length) % extendedLetters.length;

		setTimeout(() => {
			if (current < letters.length) {
				current += letters.length;
				resetSliderTransform();
			}
			isTransitioning = false;
		}, TRANSITION_DURATION);
	}

	function next() {
		if (isTransitioning) return;
		isTransitioning = true;
		current = (current + 1) % extendedLetters.length;

		setTimeout(() => {
			if (current >= letters.length * 2) {
				current -= letters.length;
				resetSliderTransform();
			}
			isTransitioning = false;
		}, TRANSITION_DURATION);
	}

	function resetSliderTransform() {
		if (sliderEl) {
			sliderEl.style.transition = 'none';
			sliderEl.style.transform = `translateX(-${current * (100 / slidesPerView)}%)`;
			setTimeout(() => (sliderEl.style.transition = 'transform 0.5s ease'), 50);
		}
	}

	function setSlide(i) {
		if (isTransitioning) return;
		current = i + letters.length;
		resetSliderTransform();
	}

	function getVisibleIndex() {
		return current % letters.length;
	}

	function openLetter(letter) {
		expandedLetter = letter;
	}

	function closeLetter() {
		expandedLetter = null;
	}

	function pauseSlider() {
		if (interval) {
			clearInterval(interval);
			interval = null;
		}
	}

	function resumeSlider() {
		if (!interval) {
			interval = setInterval(next, 3000);
		}
	}

	onMount(async () => {
		showLogo = true;
		debouncedUpdate();
		window.addEventListener('resize', debouncedUpdate);

		await tick();

		const setupObserver = (el, onIntersect) => {
			if (!el) return null;
			const obs = new IntersectionObserver(
				(entries) => {
					entries.forEach((entry) => {
						if (entry.isIntersecting) {
							onIntersect();
							obs.unobserve(entry.target);
						}
					});
				},
				{ threshold: 0.3 }
			);
			obs.observe(el);
			return obs;
		};

		const aboutObserver = setupObserver(aboutSection, () => (showAbout = true));
		const lettersObserver = setupObserver(lettersSection, () => (showLetters = true));
		const projectsObserver = setupObserver(projectsSection, () => (showProjects = true));

		interval = setInterval(next, 3000);

		return () => {
			if (interval) clearInterval(interval);
			window.removeEventListener('resize', debouncedUpdate);
			[aboutObserver, lettersObserver, projectsObserver].forEach((obs) => obs?.disconnect());
		};
	});
</script>

<!-- Hero Section -->
<section
	id="HeroSection"
	class="relative flex h-screen w-full items-center justify-center overflow-hidden"
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
				class="w-44 drop-shadow-lg sm:w-52 md:w-60 lg:w-68"
				in:fade={{ duration: 800 }}
				on:error={(e) => console.warn('Failed to load logo')}
			/>
		{/if}
	</div>
</section>

<!-- About Us Section -->
<section
  bind:this={aboutSection}
  id="AboutUsSection"
  class="flex w-full flex-col items-center justify-center bg-white px-6 py-20 md:flex-row md:items-center md:justify-between md:gap-x-12 lg:gap-x-20 md:px-12 md:py-28"
>
  {#if showAbout}
    <!-- Фото слева -->
    <div
      class="mb-10 md:mb-0 md:w-5/12 lg:w-2/5 flex justify-center md:justify-end"
      in:fly={{ x: -60, y: 0, duration: 900, delay: 100 }}
    >
      <img
        src="/images/event.jpg"
        alt="event"
        loading="lazy"
        class="object-cover rounded-2xl shadow-lg 
               h-64 w-64 
               sm:h-72 sm:w-72 
               md:h-80 md:w-80 
               lg:h-96 lg:w-96 
               transition-all duration-300 
               hover:shadow-xl hover:scale-[1.02]"
        on:error={(e) => console.warn('Failed to load about image')}
      />
    </div>

    <!-- Текст справа -->
<div
  class="flex flex-col items-center text-center md:items-start md:text-left md:w-7/12 lg:w-3/5 max-w-3xl"
  in:fly={{ x: 60, y: 0, duration: 900, delay: 300 }}
>
  <h2 class="mb-6 sm:mb-8 text-3xl font-semibold text-[#252728] sm:text-4xl md:text-4xl lg:text-5xl leading-tight">
    Global Experience.
    <br class="hidden sm:inline" />
    <span class="text-[#eb5b25]">Local Soul.</span> 
  </h2>
  <p class="text-base leading-relaxed text-[#616060] sm:text-lg md:text-xl lg:text-[20px]">
    We don’t just organize events — we create unforgettable experiences. With decades of expertise, we deliver precision, passion, and excellence in every detail: from project management and production to premium client service. We put our heart into every project.
    <br class="my-4 sm:my-6" />
    Now, we’re bringing this passion to India. Our new branch in New Delhi marks an exciting new chapter — sharing our expertise with international and local brands. We help you tell your story, connect across cultures, and impress with world-class quality. If you’re looking for more than an organizer — a true partner who cares — we’re here to make it happen.
  </p>
</div>
  {/if}
</section>

<section class="py-20 md:py-28 bg-white">
  <div class="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
    <h2 class="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 md:mb-20 text-[#252728] tracking-tight">
      Our Services
    </h2>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">

      <!-- Card 1 -->
      <div class="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-gray-100/60">
        <div class="relative h-64 overflow-hidden">
          <img
            src="cards/card1.png"
            alt="Full-Cycle Event Management"
            class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500"></div>
          
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="p-5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:scale-110 group-hover:bg-[#EB5B25]/80 transition-all duration-500">
              <svg class="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>
        </div>

        <div class="p-8 flex flex-col">
          <h3 class="text-2xl font-semibold text-[#252728] mb-5 group-hover:text-[#EB5B25] transition-colors duration-400">
            Full-Cycle Event Production
          </h3>
          <ul class="space-y-3 text-[#616060] text-[15px] leading-relaxed">
            <li>• Concept → flawless execution</li>
            <li>• Premium AV, lighting & stage design</li>
            <li>• Immersive theming & décor</li>
          </ul>
        </div>
      </div>

      <!-- Card 2 -->
      <div class="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-gray-100/60">
        <div class="relative h-64 overflow-hidden">
          <img
            src="cards/card2.png"
            alt="Corporate & Private Events"
            class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="p-5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:scale-110 group-hover:bg-[#EB5B25]/80 transition-all duration-500">
              <svg class="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <rect x="4" y="4" width="16" height="16" rx="2" />
                <circle cx="12" cy="10" r="3" />
                <path d="M8 18h8 M12 13v5" />
              </svg>
            </div>
          </div>
        </div>

        <div class="p-8 flex flex-col">
          <h3 class="text-2xl font-semibold text-[#252728] mb-5 group-hover:text-[#EB5B25] transition-colors duration-400">
            Corporate & Private Events
          </h3>
          <ul class="space-y-3 text-[#616060] text-[15px] leading-relaxed">
            <li>• Conferences & product launches</li>
            <li>• Incentive trips & team-building</li>
            <li>• Gala dinners & private celebrations</li>
          </ul>
        </div>
      </div>

      <!-- Card 3 -->
      <div class="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-gray-100/60">
        <div class="relative h-64 overflow-hidden">
          <img
            src="cards/card3.png"
            alt="Cross-Cultural & MICE"
            class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="p-5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:scale-110 group-hover:bg-[#EB5B25]/80 transition-all duration-500">
              <svg class="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <circle cx="12" cy="12" r="10" />
                <path d="M2 12h20 M12 2v20" />
              </svg>
            </div>
          </div>
        </div>

        <div class="p-8 flex flex-col">
          <h3 class="text-2xl font-semibold text-[#252728] mb-5 group-hover:text-[#EB5B25] transition-colors duration-400">
            Cross-Cultural & MICE
          </h3>
          <ul class="space-y-3 text-[#616060] text-[15px] leading-relaxed">
            <li>• Russia ↔ India delegate support</li>
            <li>• Full logistics & hospitality</li>
            <li>• Cultural bridging & VIP handling</li>
          </ul>
        </div>
      </div>

      <!-- Две нижние карточки – центрированные -->
      <div class="md:col-span-2 lg:col-span-3 flex justify-center">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10 max-w-4xl w-full">

          <!-- Card 4 -->
          <div class="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-gray-100/60">
            <div class="relative h-64 overflow-hidden">
              <img
                src="cards/card4.png"
                alt="VIP & Concierge"
                class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="p-5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:scale-110 group-hover:bg-[#EB5B25]/80 transition-all duration-500">
                  <svg class="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 2l3 7h7l-5.5 4.2L18 21l-6-4-6 4 1.5-7.8L2 9h7z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="p-8 flex flex-col">
              <h3 class="text-2xl font-semibold text-[#252728] mb-5 group-hover:text-[#EB5B25] transition-colors duration-400">
                VIP & Concierge
              </h3>
              <ul class="space-y-3 text-[#616060] text-[15px] leading-relaxed">
                <li>• Ultra-premium guest experience</li>
                <li>• Private transfers & logistics</li>
                <li>• Exclusive cultural immersions</li>
              </ul>
            </div>
          </div>

          <!-- Card 5 -->
          <div class="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 overflow-hidden border border-gray-100/60">
            <div class="relative h-64 overflow-hidden">
              <img
                src="cards/card5.png"
                alt="Art & Creative Direction"
                class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent opacity-70 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="p-5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 group-hover:scale-110 group-hover:bg-[#EB5B25]/80 transition-all duration-500">
                  <svg class="w-12 h-12 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"/>
                  </svg>
                </div>
              </div>
            </div>

            <div class="p-8 flex flex-col">
              <h3 class="text-2xl font-semibold text-[#252728] mb-5 group-hover:text-[#EB5B25] transition-colors duration-400">
                Creative Direction & Art
              </h3>
              <ul class="space-y-3 text-[#616060] text-[15px] leading-relaxed">
                <li>• Artist & talent curation</li>
                <li>• Concept & visual storytelling</li>
                <li>• Bespoke entertainment programs</li>
              </ul>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
</section>

<!-- Projects Section -->
<section bind:this={projectsSection} class="bg-[#0E1113] px-6 py-16">
	{#if showProjects}
		<div in:fly={{ y: 50, duration: 1000 }}>
			<div class="mb-8 text-center">
				<h2 class="mb-2 text-3xl font-medium text-white sm:text-4xl md:text-5xl">Our projects</h2>
			</div>

			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				{#each visibleProjects as project}
					<a
						href={`/projects/${project.slug}`}
						class="group relative block overflow-hidden rounded-2xl shadow-lg"
					>
						<img
							src={project.src}
							alt={project.alt}
							loading="lazy"
							class="h-80 w-full object-cover transition-transform duration-500 group-hover:scale-110"
						/>
						<div class="absolute inset-0 bg-gradient-to-b from-transparent to-black/50"></div>
						<div class="absolute bottom-4 left-6 font-['Okta_Neue'] text-white md:text-2xl">
							<div class="text-sm font-normal">{project.type}</div>
							<div class="text-xl font-medium md:text-2xl">{project.title}</div>
						</div>
					</a>
				{/each}
			</div>

			<!-- Кнопка "Показать все проекты" -->
			<div class="mt-10 flex justify-center">
				<a
					href="/projects"
					class="rounded-xl border border-white px-8 py-4 text-lg font-medium text-white transition hover:bg-white hover:text-black"
				>
					All projects
				</a>
			</div>
		</div>
	{/if}
</section>

<!-- Letters Section -->
<section
	bind:this={lettersSection}
	id="CharityLettersSection"
	class="flex flex-col items-center bg-white px-6 py-24"
>
	{#if showLetters}
		<div in:fly={{ y: 50, duration: 1000 }}>
			<h2 class="mb-10 text-center text-3xl font-medium text-[#0E1113] sm:text-4xl md:text-5xl">
				Clients testimonials
			</h2>
			<div class="mx-auto mb-10 h-1 w-32 rounded bg-[#EB5B25]"></div>

			<div class="relative w-full max-w-6xl">
				<div
					bind:this={sliderContainer}
					class="overflow-hidden"
					on:pointerdown={onPointerDown}
					on:pointermove={onPointerMove}
					on:pointerup={onPointerUp}
					on:touchstart={onPointerDown}
					on:touchmove={onPointerMove}
					on:touchend={onPointerUp}
					on:mouseenter={pauseSlider}
					on:mouseleave={resumeSlider}
					role="region"
					aria-label="Слайдер с отзывами клиентов"
				>
					<div
						bind:this={sliderEl}
						class="slider-track flex transition-transform duration-500 ease-in-out"
						style="transform: translateX(-{current * (100 / slidesPerView)}%);"
					>
						{#each extendedLetters as letter, i}
							<div class="w-full flex-shrink-0 p-2 sm:w-1/2 lg:w-1/3">
								<img
									src={letter}
									alt="Благодарственное письмо {(i % letters.length) + 1}"
									loading="lazy"
									class="mx-auto h-85 w-auto transform cursor-pointer rounded-lg border border-[#EB5B25] object-contain transition-transform duration-500 ease-in-out hover:scale-105 hover:shadow-lg"
									on:click={() => openLetter(letter)}
									on:touchend={() => openLetter(letter)}
									on:error={(e) => console.warn('Failed to load letter:', letter)}
								/>
							</div>
						{/each}
					</div>
				</div>

				<!-- Навигационные точки -->
				<div class="mt-8 mb-10 flex justify-center gap-4">
					{#each letters as _, i}
						<button
							on:click={() => setSlide(i)}
							class="h-4 w-4 rounded-full transition-colors focus:ring-2 focus:ring-[#EB5B25] focus:outline-none"
							class:bg-[#EB5B25]={i === getVisibleIndex()}
							class:bg-gray-300={i !== getVisibleIndex()}
							aria-label={`Переход к письму ${i + 1}`}
						/>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</section>

<!-- Letter Modal -->
{#if expandedLetter}
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
		on:click={closeLetter}
		on:keydown={(e) => e.key === 'Escape' && closeLetter()}
		in:fade
		out:fade
		role="dialog"
		aria-label="Просмотр письма"
		tabindex="0"
	>
		<div
			class="relative flex max-h-[90vh] max-w-[90vw] items-center justify-center overflow-hidden"
			on:click|stopPropagation
		>
			<img
				src={expandedLetter}
				alt="Письмо клиента"
				loading="lazy"
				class="block max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
			/>
			<!-- Кнопка закрытия -->
			<button
				class="absolute top-4 right-4 rounded-full bg-black/50 p-2 text-white hover:bg-black focus:outline-none"
				on:click={closeLetter}
				aria-label="Закрыть письмо"
			>
				✕
			</button>
		</div>
	</div>
{/if}
