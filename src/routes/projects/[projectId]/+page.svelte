<script>
	import { onMount, onDestroy } from 'svelte';
	import { browser } from '$app/environment';

	export let data;
	const project = data?.project;

	let selectedImage = null;

	function openImage(image) {
		selectedImage = image;
		if (browser) {
			document.body.style.overflow = 'hidden';
		}
	}

	function closeImage() {
		selectedImage = null;
		if (browser) {
			document.body.style.overflow = '';
		}
	}

	function handleKey(event) {
		if (event.key === 'Escape') {
			closeImage();
		}
	}

	onMount(() => {
		if (browser) {
			window.addEventListener('keydown', handleKey);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('keydown', handleKey);
		}
	});
</script>

{#if project}
	<!-- hero -->
	<section
		class="relative h-[50vh] bg-cover bg-center"
		style="background-image: url({project.src});"
	>
		<div class="absolute inset-0 bg-black/50"></div>
		<div class="relative z-10 flex h-full items-center justify-center px-6 text-center text-white">
			<div>
				<h1 class="text-4xl font-semibold">{project.title}</h1>
				<p class="mt-4 text-lg opacity-90">
	{#if project.customer}
		<span class="font-medium">Customer:</span> {project.customer}
	{/if}
	{#if project.type}
		{#if project.customer} | {/if}
		<span class="font-medium">Type:</span> {project.type}
	{/if}
	{#if project.location}
		{#if project.customer || project.type} | {/if}
		<span class="font-medium">Location:</span> {project.location}
	{/if}
	{#if Number(project.clients) > 0}
		{#if project.customer || project.type || project.location} | {/if}
		<span class="font-medium">Members:</span> {project.clients}
	{/if}
</p>
			</div>
		</div>
	</section>

	<!-- галерея -->
	{#if project.gallery.length}
		<section class="w-full bg-white px-4 py-12">
			<h2 class="mb-8 text-center text-4xl font-semibold text-[#252728]">
				Project Gallery
			</h2>

			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{#each project.gallery as image, i}
					<button
						type="button"
						class="group relative overflow-hidden rounded-2xl shadow-lg transition-transform duration-300 hover:scale-103 focus:outline-none"
						on:click={() => openImage(image)}
						aria-label="Открыть изображение проекта"
					>
						<img
							src={image.src}
							alt={image.alt || project.title}
							class="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-72 md:h-80 lg:h-96"
							loading="lazy"
						/>
					</button>
				{/each}
			</div>
		</section>
	{/if}

	<!-- модальное окно -->
	{#if selectedImage}
		<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
			<button
				type="button"
				class="absolute inset-0 cursor-zoom-out"
				on:click={closeImage}
				aria-label="Закрыть изображение"
			></button>

			<img
				src={selectedImage.src}
				alt={selectedImage.alt || project.title}
				class="relative z-10 max-h-[90vh] max-w-[90vw] rounded-xl object-contain"
			/>

			<button
				type="button"
				class="absolute top-6 right-6 z-10 text-3xl font-light text-white hover:opacity-80"
				on:click={closeImage}
				aria-label="Закрыть"
			>
				✕
			</button>
		</div>
	{/if}
{:else}
	<p class="py-20 text-center">Проект не найден</p>
{/if}
