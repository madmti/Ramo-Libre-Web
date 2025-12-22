<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';
	import { fly } from 'svelte/transition';
	import { db } from '$lib/state/index.svelte';
	import RamosListReadOnly from './_components/RamosListReadOnly.svelte';
	import StatusHeader from './_components/StatusHeader.svelte';
	import Grades from './_components/Grades.svelte';
	import Rules from './_components/Rules.svelte';

	// Estado para el ramo seleccionado
	let selectedRamoId = $state('');

	// Sincronizar el ramo seleccionado con el fragmento de la URL
	$effect(() => {
		if (!browser) return;
		const fragment = page.url.hash.slice(1);
		if (fragment && db.ramos.has(fragment)) {
			selectedRamoId = fragment;
		}
	});

	function handleSelectRamo(id: string) {
		selectedRamoId = id;
		if (browser) {
			window.location.hash = id;
		}
	}
</script>

<div class="sm:h-full sm:overflow-hidden" in:fly={{ y: 10, duration: 300, delay: 100 }}>
	<!-- Layout Grid Responsivo -->
	<div class="flex flex-col sm:grid grid-cols-1 lg:grid-cols-12 gap-6 sm:h-full">
		<!-- Panel de Lista de Ramos (Aside izquierda) -->
		<div
			class="lg:col-span-4 xl:col-span-3 flex flex-col gap-4 sm:h-full sm:min-h-0 sm:overflow-hidden"
		>
			<div class="sm:flex-1 sm:overflow-y-auto sm:min-h-0">
				<RamosListReadOnly {selectedRamoId} onSelectRamo={handleSelectRamo} />
			</div>
		</div>

		<!-- Panel Principal - 3 Componentes con scroll -->
		<div class="lg:col-span-8 xl:col-span-9 sm:h-full sm:min-h-0 sm:overflow-y-auto">
			<div class="flex flex-col gap-6 pb-6">
				<!-- Componente 1: Header de Estado -->
				<div class="sm:flex-none">
					<StatusHeader {selectedRamoId} />
				</div>

				<!-- Componente 2: Calificaciones -->
				<div class="sm:flex-none">
					<Grades {selectedRamoId} />
				</div>

				<!-- Componente 3: Reglas de Evaluación -->
				<div class="sm:flex-none">
					<Rules {selectedRamoId} />
				</div>
			</div>
		</div>
	</div>
</div>
