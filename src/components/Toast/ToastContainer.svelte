<script lang="ts">
	import ToastItem from './ToastItem.svelte';
	import toastStore from './store';
</script>

<div class="fixed | flex flex-col items-center | z-50 top-0 left-1/2 -translate-x-1/2 | space-y-1">
	{#each $toastStore as toast, i (i)}
		<ToastItem content={toast} />
	{/each}
</div>
