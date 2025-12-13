<script lang="ts">
	interface Props {
		selectedRamoId?: string;
	}

	let { selectedRamoId }: Props = $props();
</script>

<p>aqui las reglas de aprobacion: selected ramo - {selectedRamoId}</p>
