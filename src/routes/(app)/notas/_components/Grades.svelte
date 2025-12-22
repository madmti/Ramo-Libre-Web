<script lang="ts">
	interface Props {
		selectedRamoId: string;
	}

	let { selectedRamoId = '' }: Props = $props();
</script>

<div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
	<h2 class="text-xl font-semibold text-gray-900 mb-4">Grades</h2>
	{#if selectedRamoId}
		<p class="text-gray-600">Ramo seleccionado: {selectedRamoId}</p>
	{:else}
		<p class="text-gray-500">No hay ramo seleccionado</p>
	{/if}
</div>
