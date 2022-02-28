<script lang="ts">
	import { fade } from 'svelte/transition';

	import XmarkIcon from '../icons/XmarkIcon.svelte';

	// Props
	//
	export let isOpen: boolean = false;
	export let title: string;
	export let onClose: (e) => void;
</script>

{#if isOpen}
	<div
		class="fixed top-0 left-0 w-screen h-screen z-modal | p-3 | flex items-center justify-center | bg-zinc-900/95"
		transition:fade
	>
		<div
			aria-labelledby="dialog_label"
			aria-modal="true"
			class="max-w-md w-full | bg-surface drop-shadow-md rounded-xl text-neutral-100"
			role="dialog"
		>
			<div class="flex | px-4 py-3 | border-b border-neutral-700">
				<h2 class="flex-grow | text-lg" id="dialog_label">{title}</h2>
				<button on:click={onClose} class="w-6 h-6" title="Tutup">
					<span class="sr-only">Tutup</span>
					<XmarkIcon />
				</button>
			</div>
			<slot />
		</div>
	</div>
{/if}
