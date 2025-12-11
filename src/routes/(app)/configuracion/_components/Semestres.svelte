<script lang="ts">
	import { db } from '$lib/state/index.svelte';
	import { Trash2, Plus, Calendar, CircleCheck, History } from '@lucide/svelte';

	let newSemesterName = $state('');

	function handleAddKey(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			db.semestres.add(newSemesterName);
			newSemesterName = '';
		}
	}

	function handleEditKey(e: KeyboardEvent) {
		// @ts-expect-error TS doesn't know about e.currentTarget.blur()
		if (e.key === 'Enter') e.currentTarget.blur();
	}

	function handleDeleteIndex(index: number) {
		const name = db.semestres.list[index];
		db.deleteSemesterData(name);
	}

	function handleDeleteActive() {
		if (db.semestres.active === null) return;
		const name = db.semestres.activeName;
		db.deleteSemesterData(name);
	}
</script>

<div class="w-full mx-auto animate-in fade-in zoom-in-95 duration-300">
	<div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
		<div
			class="relative bg-linear-to-r from-indigo-600 to-indigo-700 p-6 sm:p-8 text-white transition-all group/hero"
		>
			<div class="flex items-center justify-between mb-2">
				<div class="flex items-center gap-2 opacity-80">
					<CircleCheck size={16} class="text-green-400" />
					<span class="text-xs font-bold uppercase tracking-widest">Periodo Actual</span>
				</div>

				{#if db.semestres.active !== null}
					<button
						onclick={handleDeleteActive}
						class="p-2 rounded-lg bg-white/10 text-white/60 hover:bg-red-500 hover:text-white transition-all backdrop-blur-sm z-20 cursor-pointer"
						title="Eliminar semestre actual"
					>
						<Trash2 size={18} />
					</button>
				{/if}
			</div>

			{#if db.semestres.active !== null && db.semestres.list[db.semestres.active] !== undefined}
				<input
					type="text"
					value={db.semestres.list[db.semestres.active]}
					oninput={(e) => db.semestres.update(db.semestres.active!, e.currentTarget.value)}
					onkeydown={handleEditKey}
					class="block w-full bg-transparent border-none outline-none text-4xl sm:text-5xl font-bold text-white placeholder-white/40 focus:ring-0 p-0 leading-tight relative z-10"
				/>
			{:else}
				<div class="text-white/50 text-3xl font-bold italic relative z-10">Sin selección</div>
				<p class="text-sm text-indigo-100 mt-2 relative z-10">
					Selecciona un semestre abajo para activarlo.
				</p>
			{/if}

			<Calendar
				class="absolute -right-5 -bottom-5 text-white/10 rotate-12 pointer-events-none"
				size={160}
			/>
		</div>

		<div class="bg-gray-50/50 flex flex-col divide-y divide-gray-100">
			{#if db.semestres.list.length > 0}
				<div
					class="px-6 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2"
				>
					<History size={12} />
					Biblioteca ({db.semestres.list.length - 1}) + 1 actual
				</div>
			{/if}
			<div class="max-h-56 overflow-y-auto">
				{#each db.semestres.list as semestre, index (index)}
					{#if index !== db.semestres.active}
						<div
							class="group flex items-center justify-between px-6 py-3 hover:bg-white transition-colors cursor-pointer"
							onclick={() => db.semestres.setActive(index)}
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') db.semestres.setActive(index);
							}}
							role="button"
							tabindex="0"
						>
							<div class="flex items-center gap-4 flex-1">
								<div
									class="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-indigo-400 group-hover:scale-110 transition-all shrink-0"
								></div>
								<input
									type="text"
									value={semestre}
									onclick={(e) => e.stopPropagation()}
									oninput={(e) => db.semestres.update(index, e.currentTarget.value)}
									class="bg-transparent border-none outline-none text-gray-600 font-medium group-hover:text-indigo-900 focus:ring-0 p-0 flex-1 cursor-text"
								/>
							</div>

							<button
								onclick={(e) => {
									e.stopPropagation();
									handleDeleteIndex(index);
								}}
								class="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-opacity cursor-pointer"
							>
								<Trash2 size={16} />
							</button>
						</div>
					{/if}
				{/each}
			</div>

			<div class="px-6 py-4 bg-white border-t border-gray-100">
				<div
					class="flex items-center gap-3 text-gray-400 focus-within:text-indigo-500 transition-colors"
				>
					<Plus size={20} />
					<input
						type="text"
						bind:value={newSemesterName}
						onkeydown={handleAddKey}
						placeholder="Crear nuevo semestre..."
						class="flex-1 bg-transparent border-none outline-none text-base text-gray-800 placeholder-gray-400 focus:ring-0 p-0"
					/>
				</div>
			</div>
		</div>
	</div>
</div>
