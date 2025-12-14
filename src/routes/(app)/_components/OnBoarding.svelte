<script lang="ts">
	import { Rocket, BookOpen, Calendar, Target, Zap } from '@lucide/svelte';

	export let semesterName: string;
	export let onStart: () => void;

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			start();
		}
	}

	function start() {
		if (semesterName.trim() !== '') {
			onStart();
		}
		semesterName = '';
	}
</script>

<div class="bg-white border border-gray-200 rounded-xl p-8 flex flex-col justify-center shadow-sm">
	<div class="mb-6 flex justify-between items-center">
		<div>
			<div class="flex gap-2 items-center">
				<img src="/favicon.webp" alt="Ramo Libre Logo" class="w-15 h-15" />
				<h1 class="text-4xl font-bold tracking-tight mb-2 text-gray-900">Ramo Libre</h1>
			</div>
			<p class="text-gray-600 text-lg">Tu nueva herramienta favorita para no reprobar.</p>
		</div>
		<div>
			<div class="text-right max-sm:hidden">
				<p class="text-sm text-gray-500 font-medium flex items-center justify-end">
					Tutorial Rápido
					<Zap class="inline-block w-4 h-4 ml-1" />
				</p>
				<p class="text-xs text-gray-400">Sigue estos pasos para comenzar</p>
			</div>
		</div>
	</div>

	<div class="mb-6">
		<h2 class="text-lg font-semibold text-gray-800 mb-4">¿Cómo empezar?</h2>
		<div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
			<div class="flex items-center gap-2 text-gray-600">
				<Calendar class="w-4 h-4 text-blue-500" />
				<span>1. Ingresa el nombre del semestre</span>
			</div>
			<div class="flex items-center gap-2 text-gray-600">
				<BookOpen class="w-4 h-4 text-green-500" />
				<span>2. Configura tus ramos y notas</span>
			</div>
			<div class="flex items-center gap-2 text-gray-600">
				<Target class="w-4 h-4 text-red-500" />
				<span>3. Establece tus metas académicas</span>
			</div>
		</div>
	</div>

	<div class="flex flex-col sm:flex-row gap-3">
		<input
			bind:value={semesterName}
			on:keydown={handleKeydown}
			placeholder="Nombre del Semestre (Ej: 2025-1)"
			class="flex-1 h-12 px-4 max-sm:py-2 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
		/>
		<button
			on:click={start}
			class="h-12 cursor-pointer px-8 text-lg bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
		>
			Empezar <Rocket class="inline-block w-5 h-5 ml-2" />
		</button>
	</div>
</div>
