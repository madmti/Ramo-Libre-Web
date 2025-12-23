<script lang="ts">
	import { solverWASM } from '$lib';
	import { onMount } from 'svelte';

	let { children } = $props();

	onMount(async () => {
		await solverWASM.initialize();

		// Test de verificación del módulo WASM
		if (solverWASM.isReady) {
			const testInput = {
				name: 'Química Lab - Test',
				strategy: 'uniform',
				rules: [
					{ type: 'global_average', target: 55, description: 'Global' },
					{
						type: 'min_grade_per_tag',
						target: 40,
						tag_filter: 'labs',
						description: 'Min Lab'
					}
				],
				assessments: [
					{ name: 'Teoria', weight: 0.6, grade: 70.0 },
					{ name: 'Lab 1', weight: 0.2, grade: 100.0, tags: ['labs'] },
					{ name: 'Lab 2', weight: 0.2, grade: null, tags: ['labs'] }
				]
			};

			const { result, success, error } = await solverWASM.solve(JSON.stringify(testInput));

			if (success) {
				console.log('✅ WASM Test exitoso:', JSON.stringify(result, null, 2));
			} else {
				console.error('❌ WASM Test falló:', error);
			}
		} else {
			console.warn('⚠️ WASM no está listo para el test');
		}
	});
</script>

{@render children()}
