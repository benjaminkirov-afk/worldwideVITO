<script>
	import { fly } from 'svelte/transition';
</script>

<div class="relative min-h-screen">
	<div in:fly={{ y: 50, duration: 800, delay: 100 }} class="absolute inset-0">
		<img
			src="https://static.maps.2gis.com/1.0?s=1280x1280@2x&center=37.53227,55.766105&zoom=16"
			alt="2GIS Map"
			class="h-full w-full object-cover grayscale filter"
		/>
	</div>

	<div class="absolute inset-0 bg-black/20"></div>
	<div class="absolute inset-0 bg-gradient-to-l from-black/80 via-black/40 to-transparent"></div>

	<div
		class="relative z-10 flex min-h-screen items-center justify-center px-6 md:justify-end md:pr-20"
	>
		<div class="flex w-full max-w-md flex-col gap-8 text-white">
			<div
				in:fly={{ x: 50, duration: 600, delay: 300 }}
				class="flex flex-col items-center gap-2 md:flex-row md:items-center"
			>
				<div class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white">
					<i class="fas fa-phone text-lg"></i>
				</div>
				<a
					href="tel:+74956642272"
					class="text-center text-2xl transition-colors hover:text-orange-500 md:text-left"
				>
					+7 (495) 664-22-72
				</a>
			</div>

			<div
				in:fly={{ x: 50, duration: 600, delay: 500 }}
				class="flex flex-col items-center gap-2 md:flex-row md:items-start"
			>
				<div class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white">
					<i class="fas fa-map-marker-alt text-lg"></i>
				</div>
				<a
					href="https://yandex.ru/maps/?text=г.%20Москва,%201-й%20магистральный%20тупик,%205A"
					target="_blank"
					rel="noopener noreferrer"
					class="text-center text-xl leading-snug transition-colors hover:text-orange-500 md:text-left"
				>
					Москва<br />
					1-й Магистральный тупик, 5А
				</a>
			</div>

			<div
				in:fly={{ x: 50, duration: 600, delay: 700 }}
				class="flex flex-col items-center gap-2 md:flex-row md:items-center"
			>
				<div class="flex h-12 w-12 items-center justify-center rounded-full border-2 border-white">
					<i class="fas fa-envelope text-lg"></i>
				</div>
				<a
					href="mailto:info@vitopro.ru"
					class="text-center text-2xl transition-colors hover:text-orange-500 md:text-left"
				>
					info@vitopro.ru
				</a>
			</div>
		</div>
	</div>
</div>
