<script lang="ts">
	import ToastItem from './ToastItem.svelte';
	import toastStore from './store';
</script>

<div class="fixed | z-50 top-0 | space-y-1">
	{#each $toastStore as toast, i (i)}
		<ToastItem content={toast} />
	{/each}
</div>
