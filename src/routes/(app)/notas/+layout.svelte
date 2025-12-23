<script lang="ts">
	import { solverWASM } from '$lib';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(() => {
		solverWASM.initialize();
	});
</script>

{@render children()}
