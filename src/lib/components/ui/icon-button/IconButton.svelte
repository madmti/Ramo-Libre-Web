<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	interface IconButtonProps extends HTMLButtonAttributes {
		variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
		size?: 'sm' | 'default' | 'lg';
		class?: string;
		children: Snippet;
	}

	let {
		variant = 'ghost',
		size = 'default',
		class: className = '',
		children,
		...restProps
	}: IconButtonProps = $props();

	// Size mappings for icon buttons
	const sizeClasses = {
		sm: 'h-8 w-8 p-1.5',
		default: 'h-9 w-9 p-2',
		lg: 'h-10 w-10 p-2.5'
	};
</script>

<Button
	{variant}
	class="rounded-lg transition-colors {sizeClasses[size]} {className}"
	{...restProps}
>
	{@render children()}
</Button>