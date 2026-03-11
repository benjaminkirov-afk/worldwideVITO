<script>
	import '../app.css';
	import Footer from '../components/Footer.svelte';
	import Header from '../components/Header.svelte';

	let y = 0;
	let innerWidth = 0;
	let innerHeight = 0;

	function moveUserTop() {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
</script>

<!-- 🏷️ Head с favicon и дефолтным title -->
<svelte:head>
	<title>VITO | Организация мероприятий</title>
	<link rel="icon" href="/images/favicon.ico?v=2" />
	<meta name="description" content="Events" />
</svelte:head>

<div class="flex min-h-screen flex-col text-sm sm:text-base">
	<Header />
	<slot />
	<Footer />
</div>

<!-- Кнопка вверх -->
<div
	class={'fixed right-10 bottom-10 z-[90] transition-opacity duration-200 ' +
		(y > 100 ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0')}
>
	<button
		on:click={moveUserTop}
		class="flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#EB5B25] text-white duration-300 hover:bg-[#F66027]"
	>
		<i class="fa solid fa-arrow-up"></i>
	</button>
</div>

<svelte:window bind:scrollY={y} bind:innerWidth bind:innerHeight />
