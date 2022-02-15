<script context="module" lang="ts">
	export type AnswerBoxVariant = 'correct' | 'focused' | 'idle' | 'misplaced' | 'wrong';
</script>

<script lang="ts">
	import clsx from 'clsx';

	export let value: string = '';
	export let variant: AnswerBoxVariant = 'idle';

	let backgroundStyle = 'bg-stone-900';
	let borderStyle = '';

	$: switch (variant) {
		case 'correct':
			backgroundStyle = 'bg-emerald-800';
			break;
		case 'focused':
			borderStyle = 'border border-dashed border-neutral-300';
			break;
		case 'idle':
			borderStyle = 'border border-neutral-700';
			break;
		case 'misplaced':
			backgroundStyle = 'bg-yellow-700';
			break;
		case 'wrong':
			backgroundStyle = 'bg-stone-800';
			break;
	}
</script>

<div
	class={clsx(
		'| root',
		'| flex justify-center items-center',
		'| w-full h-full',
		`| ${backgroundStyle} ${borderStyle} uppercase text-neutral-100 text-2xl xxs:text-3xl xs:text-4xl`
	)}
>
	{value}
</div>

<style>
	.root::before {
		content: '';
		padding-bottom: 100%;
		display: block;
	}
</style>
