<script context="module" lang="ts">
	export type AnswerBoxVariant = 'correct' | 'focused' | 'idle' | 'misplaced' | 'wrong';
</script>

<script lang="ts">
	import clsx from 'clsx';

	import CircleIcon from '../icons/CircleIcon.svelte';
	import CheckIcon from '../icons/CheckIcon.svelte';
	import XmarkIcon from '../icons/XmarkIcon.svelte';

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
		'| relative | flex justify-center items-center',
		'| w-full h-full',
		`| ${backgroundStyle} ${borderStyle} uppercase text-neutral-100 text-2xl xxs:text-3xl xs:text-4xl uppercase`
	)}
>
	<span
		class="absolute bottom-0 left-0 | w-3 xxs:w-4 xs:w-5 h-3 xxs:h-4 xs:h-5 text-neutral-400"
	>
		{#if variant === 'correct'}
			<CheckIcon />
		{:else if variant === 'misplaced'}
			<CircleIcon />
		{:else if variant === 'wrong'}
			<XmarkIcon />
		{/if}
	</span>
	{value}
</div>

<style>
	.root::before {
		content: '';
		padding-bottom: 100%;
		display: block;
	}
</style>
