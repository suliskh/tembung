<script lang="ts">
	import { fade } from 'svelte/transition';
	import { onDestroy } from 'svelte';

	// Props
	//
	export let content: string;

	// States
	//
	let isVisible = true;
	let timer = setTimeout(() => (isVisible = false), 2000);

	onDestroy(() => clearTimeout(timer));
</script>

{#if isVisible}
	<div
		transition:fade
		class=" max-w-lg px-3 py-1 | rounded-xl border border-amber-500 bg-amber-100 text-neutral-700 shadow-md shadow-amber-400/40"
	>
		{content}
	</div>
{/if}
