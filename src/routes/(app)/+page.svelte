<script lang="ts">
	import { fly } from 'svelte/transition';
	import { db } from '$lib/state/index.svelte';
	import OnBoarding from './_components/OnBoarding.svelte';
	import GradeSolver from './_components/GradeSolver.svelte';
	import Offline from './_components/Offline.svelte';
	import Github from './_components/Github.svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	let semesterName = '';

	function handleStart() {
		if (!semesterName) return;
		db.semestres.add(semesterName);
		goto(resolve('/configuracion'));
	}
</script>

<div in:fly={{ y: 10, duration: 300, delay: 100 }} class="grid h-full w-full">
	{#if db.semestres.list.length > 0}
		<div
			class="flex flex-col items-center justify-center h-full w-full text-center gap-4 p-6 bg-white rounded-lg shadow-md"
		>
			<h2 class="text-2xl font-bold">¡Ya tienes semestres configurados!</h2>
		</div>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
			<div class="md:col-span-2 grid">
				<OnBoarding bind:semesterName onStart={handleStart} />
			</div>
			<GradeSolver />
			<Github />
			<div class="md:col-span-2 grid">
				<Offline />
			</div>
		</div>
	{/if}
</div>
