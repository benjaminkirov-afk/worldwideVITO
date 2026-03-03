<script>
	import { page } from '$app/stores';
	import { derived } from 'svelte/store';
	import { fly } from 'svelte/transition';

	let tabs = [
		{ name: 'Projects', link: '/projects' },
		{ name: 'About', link: '#AboutUsSection' },
		{ name: 'Contacts', link: '/contacts' }
	];

	let menuOpen = false;
	function toggleMenu() {
		menuOpen = !menuOpen;
	}
	function closeMenu() {
		menuOpen = false;
	}

	const displayedTabs = derived(page, ($page) => {
		const path = $page.url.pathname;

		let result = path !== '/' ? [{ name: 'Home', link: '/' }, ...tabs] : tabs;

		return result;
	});

	function handleTabClick(event, tab) {
		if (tab.name === 'О нас') {
			const path = $page.url.pathname;
			if (path === '/') {
				event.preventDefault();
				const el = document.querySelector(tab.link);
				if (el) el.scrollIntoView({ behavior: 'smooth' });
			} else {
				tab.link = '/#AboutUsSection';
			}
		}

		closeMenu();
	}
</script>

<header
	class="absolute top-0 left-0 z-[100] flex w-full items-center justify-end px-6 py-8 text-white md:px-10"
>
	<!-- Десктопная навигация — тонкий шрифт -->
	<nav class="hidden items-center gap-8 text-[18px] font-normal md:flex">
		{#each $displayedTabs as tab, i}
			<a
				href={tab.link}
				class="group relative"
				in:fly={{ x: 20, duration: 400, delay: i * 100 }}
				on:click={(e) => handleTabClick(e, tab)}
			>
				<span class="transition-colors duration-200">{tab.name}</span>
				<span
					class="absolute -bottom-1 left-0 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full"
				></span>
			</a>
		{/each}
	</nav>

	<button class="absolute top-4 right-4 z-[101] text-2xl md:hidden" on:click={toggleMenu}>
		<i class={menuOpen ? 'fas fa-times text-white' : 'fas fa-bars text-white'}></i>
	</button>

	<!-- Мобильное меню — тоже тонкий шрифт -->
	<nav
		class={`fixed inset-0 z-[99] flex flex-col items-center justify-center gap-8 bg-[#0E1113] transition-transform duration-300 md:hidden ${menuOpen ? 'translate-y-0' : '-translate-y-full'}`}
	>
		{#each $displayedTabs as tab, i}
			<a
				href={tab.link}
				class="text-2xl font-normal text-white"
				on:click={(e) => handleTabClick(e, tab)}
			>
				{tab.name}
			</a>
		{/each}
	</nav>
</header>