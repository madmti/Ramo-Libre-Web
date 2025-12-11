<script lang="ts">
	import { db } from '$lib/state/index.svelte.js';
	import { BookOpen } from '@lucide/svelte';

	interface Props {
		selectedRamoId: string;
	}

	let { selectedRamoId = '' }: Props = $props();

	// Computed para el ramo seleccionado
	const selectedRamo = $derived(selectedRamoId ? db.ramos.get(selectedRamoId) : null);
</script>

{#if selectedRamo}
	<div class="bg-white border border-slate-200 rounded-xl p-6 h-full">
		<!-- Contenido principal del ramo -->
		<div class="h-full flex items-center justify-center">
			<div class="text-center text-slate-400">
				<BookOpen class="w-12 h-12 mx-auto mb-4 text-slate-300" />
				<p class="text-lg font-medium">Detalles del Ramo</p>
				<p class="text-sm mt-2">
					Aquí irá el componente con los datos de {selectedRamo.nombre}
				</p>
			</div>
		</div>
	</div>
{:else}
	<div class="bg-slate-100 border border-slate-200 rounded-xl p-6 h-full">
		<div class="text-center text-slate-400 h-full flex items-center justify-center">
			<div>
				<BookOpen class="w-12 h-12 mx-auto mb-4 text-slate-300" />
				<p class="text-lg font-medium">Contenido del ramo</p>
				<p class="text-sm mt-2">Selecciona un ramo para ver su contenido</p>
			</div>
		</div>
	</div>
{/if}
