<script>
	import Main from '../components/Main.svelte';
	export let data; // данные из +page.server.js
</script>

<Main {data} />
