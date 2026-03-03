<script>
	import { fly } from 'svelte/transition';
</script>

<div class="relative min-h-screen overflow-hidden">
	<!-- Статичная карта (серая) -->
	<img
		src="/test.png"
		alt="Карта офиса Vito Team в Malviya Nagar, New Delhi"
		class="absolute inset-0 h-full w-full object-cover grayscale"
	/>

	<!-- Лёгкий оверлей -->
	<div class="absolute inset-0 bg-black/30 pointer-events-none" />

	<!-- Контакты с единым стилем текста -->
	<div
		class="relative z-20 flex min-h-screen items-center justify-center px-5 sm:px-8 md:justify-end md:pr-16 lg:pr-24"
	>
		<div class="w-full max-w-md lg:max-w-lg flex flex-col gap-8 text-white">  <!-- уменьшил gap с 10 на 8 -->

			<!-- Телефон -->
			<div
				in:fly={{ x: 60, duration: 700, delay: 200 }}
				class="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-2xl border border-white/10 shadow-xl"
			>
				<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-black/50">
					<i class="fas fa-phone text-lg text-orange-500" />  <!-- чуть уменьшил иконку -->
				</div>
				<a
					href="tel:+919876543210"
					class="text-2xl md:text-2.5xl font-medium transition-colors hover:text-orange-400"
				>
					+91 987 654 32 10
				</a>
			</div>

			<!-- Адрес — коротко, тот же font-medium -->
			<div
				in:fly={{ x: 60, duration: 700, delay: 400 }}
				class="flex items-start gap-4 bg-black/40 px-6 py-4 rounded-2xl border border-white/10 shadow-xl"
			>
				<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-black/50">
					<i class="fas fa-map-marker-alt text-lg text-orange-500" />
				</div>
				<a
					href="https://www.openstreetmap.org/search?query=28.534%2C77.212"
					target="_blank"
					rel="noopener noreferrer"
					class="text-lg md:text-xl font-medium leading-tight transition-colors hover:text-orange-400"
				>
					New Delhi, 110017<br />
					Malviya Nagar, 1 Eldeco Centre
				</a>
			</div>

			<!-- Email — тот же font-medium -->
			<div
				in:fly={{ x: 60, duration: 700, delay: 600 }}
				class="flex items-center gap-4 bg-black/40 px-6 py-4 rounded-2xl border border-white/10 shadow-xl"
			>
				<div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-orange-500 bg-black/50">
					<i class="fas fa-envelope text-lg text-orange-500" />
				</div>
				<a
					href="mailto:main@vitoteam.in"
					class="text-2xl md:text-2.5xl font-medium transition-colors hover:text-orange-400"
				>
					main@vitoteam.in
				</a>
			</div>
		</div>
	</div>
</div>