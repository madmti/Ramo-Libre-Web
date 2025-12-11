<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { IconButton } from '$lib/components/ui/icon-button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { Trash, Plus, Minus } from '@lucide/svelte';
	import { slide } from 'svelte/transition';
	import { db } from '$lib/state/index.svelte.js';
	import { ColorUtils } from '$lib/utils/colors.js';

	interface Props {
		selectedRamoId: string;
		onSelectRamo: (id: string) => void;
	}

	let { selectedRamoId = '', onSelectRamo }: Props = $props();

	// Estado local para el formulario
	let nombreRamo = $state('');
	let isFormExpanded = $state(false);

	// Computed para verificar si hay ramos
	const hasRamos = $derived(db.ramos.list.length > 0);

	// Auto-expandir cuando no hay ramos
	$effect(() => {
		if (!hasRamos) {
			isFormExpanded = true;
		}
	});

	function handleAgregar() {
		if (!nombreRamo.trim()) return;

		const id = db.ramos.add({
			nombre: nombreRamo,
			color: ColorUtils.getRandomColor()
		});

		nombreRamo = '';

		// Seleccionar automáticamente el nuevo ramo
		if (id) {
			onSelectRamo(id);
		}
	}

	function handleRemoveRamo(id: string) {
		if (selectedRamoId === id) {
			onSelectRamo('');
		}
		db.ramos.remove(id);
	}
</script>

<div class="bg-white border border-slate-200 rounded-xl p-6 flex flex-col h-full min-h-0 overflow-hidden">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6 shrink-0">
		<h2 class="text-xl font-bold text-slate-800">Mis Ramos</h2>
		{#if hasRamos}
			<Tooltip.Root>
				<Tooltip.Trigger>
					<IconButton
						onclick={() => (isFormExpanded = !isFormExpanded)}
						class="text-slate-500 hover:text-orange-500 hover:bg-orange-50"
						size="sm"
						aria-label={isFormExpanded ? 'Ocultar formulario' : 'Mostrar formulario'}
					>
						{#if isFormExpanded}
							<Minus class="w-4 h-4" />
						{:else}
							<Plus class="w-4 h-4" />
						{/if}
					</IconButton>
				</Tooltip.Trigger>
				<Tooltip.Content side="top">
					<p>{isFormExpanded ? 'Ocultar formulario' : 'Agregar nuevo ramo'}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/if}
	</div>

	<!-- Formulario para agregar ramo -->
	{#if isFormExpanded}
		<div transition:slide={{ duration: 300 }} class="space-y-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 shrink-0">
			<div class="space-y-2">
				<label for="nombreRamo" class="text-sm font-semibold text-slate-600">
					Nueva Asignatura
				</label>
				<input
					id="nombreRamo"
					type="text"
					bind:value={nombreRamo}
					onkeydown={(e) => e.key === 'Enter' && handleAgregar()}
					placeholder="Ej: Arquitectura de Software"
					class="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
				/>
			</div>

			<Button
				onclick={handleAgregar}
				disabled={!nombreRamo.trim()}
				class="w-full bg-orange-500 hover:bg-orange-600 text-white"
				variant="default"
			>
				<Plus class="w-4 h-4 mr-2" />
				Agregar Ramo
			</Button>
		</div>
	{/if}

	<!-- Lista de Ramos -->
	<div class="space-y-3 flex-1 overflow-y-auto min-h-0">
		{#each db.ramos.list as [id, ramo] (id)}
			<div
				class="group flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 cursor-pointer {selectedRamoId === id
					? 'bg-orange-50 border-orange-200 shadow-sm'
					: 'bg-white border-slate-200 hover:border-orange-200 hover:bg-orange-50/50'}"
				onclick={() => onSelectRamo(id)}
				role="button"
				tabindex="0"
				onkeydown={(e) => e.key === 'Enter' && onSelectRamo(id)}
			>
				<!-- Indicador de color -->
				<div
					class="h-10 w-10 rounded-lg text-white shadow-sm border border-white/20 flex items-center justify-center font-bold text-sm transition-all"
					style="background-color: {ramo.color};"
				>
					{ramo.nombre.substring(0, 2).toUpperCase()}
				</div>

				<div class="flex-1 min-w-0">
					<div class="font-semibold text-slate-800 truncate">{ramo.nombre}</div>
					<div class="text-xs text-slate-400 font-mono">
						{id.slice(0, 8)}
					</div>
				</div>

				<!-- Botón eliminar -->
				<Tooltip.Root>
					<Tooltip.Trigger>
						<IconButton
							onclick={(e) => {
								e.stopPropagation();
								handleRemoveRamo(id);
							}}
							class="text-slate-300 hover:text-rose-500 hover:bg-rose-50 opacity-0 group-hover:opacity-100 cursor-pointer transition-all"
							size="sm"
							aria-label="Borrar ramo"
						>
							<Trash class="w-4 h-4" />
						</IconButton>
					</Tooltip.Trigger>
					<Tooltip.Content side="right">
						<p>Eliminar ramo</p>
					</Tooltip.Content>
				</Tooltip.Root>
			</div>
		{:else}
			<div class="text-center py-8 text-slate-400">
				<p class="text-sm">No hay ramos registrados.</p>
				<p class="text-xs mt-1">Agrega uno usando el formulario.</p>
			</div>
		{/each}
	</div>
</div>
