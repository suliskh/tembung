<script lang="ts">
	import clsx from 'clsx';

	// Props
	//
	export let variant: 'success' | 'danger';
</script>

<div
	class={clsx(
		'flex | p-3',
		'| rounded-md',
		'| text-neutral-300',
		variant === 'success' ? 'border-l-4 border-emerald-800 bg-emerald-900/20' : '',
		variant === 'danger' ? 'border-l-4 border-rose-800 bg-rose-900/20' : ''
	)}
>
	<slot />
</div>
