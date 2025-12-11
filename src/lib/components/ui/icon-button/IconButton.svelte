<script lang="ts">
	import { Button, type ButtonProps } from '$lib/components/ui/button';
	import type { Snippet } from 'svelte';

	interface IconButtonProps extends Omit<ButtonProps, 'children' | 'size'> {
		size?: 'sm' | 'default' | 'lg';
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
