<script lang="ts">
	import { CalendarDays } from '@lucide/svelte';
</script>

<div
	class="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm h-64 flex items-center justify-center relative overflow-hidden group"
>
	<div class="flex items-center gap-2 text-purple-500">
		<CalendarDays class="w-5 h-5" />
		<h2 class="text-lg font-semibold">Proximos hitos</h2>
	</div>
</div>
