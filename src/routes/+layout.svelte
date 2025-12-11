<script lang="ts">
	import './layout.css';
	import './custom.css';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href="/favicon.webp" />
	<title>Ramo Libre</title>
</svelte:head>

<div class="h-full w-full flex flex-col max-sm:flex-col-reverse">
	{@render children()}
</div>
