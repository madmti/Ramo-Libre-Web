<script lang="ts">
	import { db } from '$lib/state/index.svelte.js';
	import { BookOpen, Calculator, Clock, Shield } from '@lucide/svelte';
	import Ecuacion from './tabs/Ecuacion.svelte';
	import Horarios from './tabs/Horarios.svelte';
	import Reglas from './tabs/Reglas.svelte';

	interface Props {
		selectedRamoId: string;
	}

	let { selectedRamoId = '' }: Props = $props();

	// Computed para el ramo seleccionado
	const selectedRamo = $derived(selectedRamoId ? db.ramos.get(selectedRamoId) : null);

	// Estado para el tab activo
	let activeTab = $state('ecuacion');

	// Configuración de tabs
	const tabs = [
		{
			id: 'horarios',
			label: 'Horarios',
			icon: Clock,
			component: Horarios
		},
		{
			id: 'ecuacion',
			label: 'Ecuación de Nota',
			icon: Calculator,
			component: Ecuacion
		},
		{
			id: 'reglas',
			label: 'Reglas de Aprobación',
			icon: Shield,
			component: Reglas
		}
	];

	// Función para cambiar de tab
	function setActiveTab(tabId: string) {
		activeTab = tabId;
	}

	// Obtener el componente activo
	const activeComponent = $derived(tabs.find((tab) => tab.id === activeTab)?.component);
</script>

{#if selectedRamo}
	<div class="bg-white border border-slate-200 rounded-xl h-full flex flex-col">
		<!-- Tabs Navigation -->
		<div class="px-6 pt-4">
			<nav class="flex space-x-1 bg-slate-100 p-1 rounded-lg">
				{#each tabs as tab (tab.id)}
					<button
						onclick={() => setActiveTab(tab.id)}
						class="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex-1 justify-center
							{activeTab === tab.id
							? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
							: 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}"
					>
						<svelte:component this={tab.icon} size={16} />
						<span class="hidden sm:inline">{tab.label}</span>
					</button>
				{/each}
			</nav>
		</div>

		<!-- Tab Content -->
		<div class="flex-1 p-6 overflow-y-auto">
			{#if activeComponent}
				{#if activeTab === 'ecuacion'}
					<svelte:component this={activeComponent} {selectedRamoId} />
				{:else}
					<svelte:component this={activeComponent} />
				{/if}
			{/if}
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
