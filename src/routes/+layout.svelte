<script lang="ts">
	import './layout.css';
	import './custom.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="h-full w-full flex flex-col">
	{@render children()}
</div>
