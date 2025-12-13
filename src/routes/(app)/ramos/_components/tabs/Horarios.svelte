<script lang="ts">
	interface Props {
		selectedRamoId?: string;
	}

	let { selectedRamoId }: Props = $props();
</script>

<p>Aqui los horarios: selected ramo - {selectedRamoId}</p>
