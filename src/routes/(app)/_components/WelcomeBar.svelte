<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { GithubIcon, RefreshCw } from '@lucide/svelte';

	let userName = 'Usuario';
	let userMail = 'usuario@ramolibre.cl';
	let syncStatus = 'Synced';

	const provider = 'Github';
	const providerColors = {
		Github: 'bg-gray-800 text-white hover:bg-gray-700',
		Google: 'bg-red-500 text-white hover:bg-red-600',
		Facebook: 'bg-blue-600 text-white hover:bg-blue-700'
	};
	const providerIcons = {
		Github: GithubIcon,
		Google: null,
		Facebook: null
	};

	const syncStatusColors = {
		Synced: 'bg-green-100 text-green-800 hover:bg-green-200',
		Syncing: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
		Error: 'bg-red-100 text-red-800 hover:bg-red-200'
	};

	function handleProviderClick() {
		// Handle provider badge click
		console.log('Provider badge clicked');
	}

	function handleSyncClick() {
		goto(resolve('/configuracion#sync' as '/configuracion'));
	}
</script>

<div
	class="bg-white rounded-lg border border-gray-200 p-6 shadow-sm flex items-center justify-between"
>
	<div>
		<h1 class="text-xl sm:text-2xl font-bold text-gray-800">Hola, {userName} 👋</h1>
		<p class="text-gray-500 text-sm">Aquí está tu resumen de hoy.</p>
	</div>
	<div class="flex items-center space-x-3 justify-end">
		<div class="text-sm text-right">
			<div class="font-medium text-gray-900">{userMail}</div>
			<div class="text-gray-500 flex items-center justify-end space-x-1 mt-1">
				<button
					on:click={handleSyncClick}
					class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200 {syncStatusColors[
						syncStatus as keyof typeof syncStatusColors
					]} gap-1"
				>
					<RefreshCw size={12} />
					{syncStatus}
				</button>
				<button
					on:click={handleProviderClick}
					class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors duration-200 {providerColors[
						provider
					]} gap-1"
				>
					{#if providerIcons[provider]}
						<svelte:component this={providerIcons[provider]} size={12} />
					{/if}
					<span>{provider}</span>
				</button>
			</div>
		</div>
		<div
			class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold"
		>
			{userName.charAt(0).toUpperCase()}
		</div>
	</div>
</div>
