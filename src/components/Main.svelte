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
		style="background-image: url('/images/hero.png');"
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
	class="flex w-full flex-col items-center justify-center bg-white px-6 py-20 md:flex-row md:items-center md:justify-center md:gap-x-12 md:px-12 md:py-28"
>
	{#if showAbout}
		<div
			class="flex flex-col items-center text-center md:w-1/2"
			in:fly={{ x: 0, y: 50, duration: 1000, delay: 200 }}
		>
			<img
				src="/images/Igor_Vernik.jpg"
				alt="Игорь Верник"
				loading="lazy"
				class="mb-6 h-72 w-72 rounded-full object-cover shadow-lg md:h-80 md:w-80"
				on:error={(e) => console.warn('Failed to load about image')}
			/>
			<h2 class="mb-10 text-3xl font-medium text-[#252728] sm:text-4xl md:text-5xl">
				Агентство <span class="text-[#EB5B25]">событий</span> <br />для бизнеса
			</h2>
			<p class="text-base font-normal text-[#616060] sm:text-lg md:text-[20px]">
				Мы тут делаем события так, чтобы они запоминались. Берём идею, докручиваем её, собираем команду - и превращаем всё в живую историю, которая работает на бренд и людей. Честно, мы просто любим своё дело и делаем так, чтобы всем было хорошо - и организаторам, и гостям.
			</p>
		</div>
	{/if}
</section>

<!-- Projects Section -->
<section bind:this={projectsSection} class="bg-[#0E1113] px-6 py-16">
	{#if showProjects}
		<div in:fly={{ y: 50, duration: 1000 }}>
			<div class="mb-8 text-center">
				<h2 class="mb-2 text-3xl font-medium text-white sm:text-4xl md:text-5xl">Наши проекты</h2>
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
					Показать все проекты
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
				Что о нас говорят клиенты
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
