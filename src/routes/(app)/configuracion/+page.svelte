<script>
	import { fly } from 'svelte/transition';
	import Semestres from './components/Semestres.svelte';
	import Sincronizacion from './components/Sincronizacion.svelte';
	import Aparicencia from './components/Apariencia.svelte';
	import About from './components/About.svelte';
</script>

<div in:fly={{ y: 10, duration: 300, delay: 100 }} class="p-4 w-full">
	<div class="columns-1 lg:columns-2 gap-6 space-y-6">
		<div class="break-inside-avoid">
			<Semestres />
		</div>

		<div class="break-inside-avoid">
			<Aparicencia />
		</div>

		<div class="break-inside-avoid">
			<Sincronizacion />
		</div>

		<div class="break-inside-avoid">
			<About />
		</div>
	</div>
</div>
