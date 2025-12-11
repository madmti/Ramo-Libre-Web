<script lang="ts">
	import { db } from '$lib/state/index.svelte.js';
	import { ColorUtils } from '$lib/utils/colors.js';

	interface Props {
		selectedRamoId: string;
	}

	let { selectedRamoId = '' }: Props = $props();

	// Computed para el ramo seleccionado
	const selectedRamo = $derived(selectedRamoId ? db.ramos.get(selectedRamoId) : null);

	function handleColorChange(color: string) {
		if (selectedRamoId && selectedRamo) {
			db.ramos.update(selectedRamoId, { ...selectedRamo, color });
		}
	}
</script>

<div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
	<h3 class="text-xs font-semibold text-slate-500 mb-2">
		Colores disponibles{selectedRamo ? ' - Toca para cambiar' : ''}:
	</h3>
	<div class="flex flex-wrap gap-1.5">
		{#each ColorUtils.COLORS as color (color)}
			<button
				class="h-4 w-4 rounded border border-white/20 shadow-sm transition-all {selectedRamo
					? 'hover:scale-125 cursor-pointer'
					: 'cursor-default'} {selectedRamo && selectedRamo.color === color
					? 'ring-2 ring-slate-400'
					: ''}"
				style="background-color: {color}"
				title={color}
				onclick={() => handleColorChange(color)}
				disabled={!selectedRamo}
			></button>
		{/each}
	</div>
</div>
