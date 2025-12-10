<script lang="ts">
	import NavItem from '$lib/components/NavItem.svelte';
	import {
		GraduationCap,
		CalendarCheck,
		TrendingUp,
		CalendarDays,
		BookMarked,
		Bolt
	} from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	type Icon = Snippet<[{ class?: string }]>;

	let { children } = $props();
</script>

<nav class="grid grid-cols-6 gap-4 mb-6">
	<NavItem href="/" color="indigo" text="RamoLibre" icon={GraduationCap as Icon} />
	<NavItem href="/horarios" color="blue" text="Horarios" icon={CalendarCheck as Icon} disabled />
	<NavItem href="/notas" color="green" text="Notas" icon={TrendingUp as Icon} disabled />
	<NavItem
		href="/calendario"
		color="purple"
		text="Calendario"
		icon={CalendarDays as Icon}
		disabled
	/>
	<NavItem href="/ramos" color="orange" text="Ramos" icon={BookMarked as Icon} disabled />
	<NavItem href="/configuracion" color="slate" text="Configuración" icon={Bolt as Icon} />
</nav>

<div class="rounded-2xl bg-white shadow-sm border border-gray-200 flex-1 overflow-hidden">
	{@render children()}
</div>
