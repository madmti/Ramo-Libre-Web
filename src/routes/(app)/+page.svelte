<script>
	import { fly } from 'svelte/transition';
</script>

<div in:fly={{ y: 10, duration: 300, delay: 100 }}>
	<h1>landing/welcome</h1>
</div>
