<script lang="ts">
	import clsx from 'clsx';

	import CircleIcon from '../icons/CircleIcon.svelte';
	import CheckIcon from '../icons/CheckIcon.svelte';
	import XmarkIcon from '../icons/XmarkIcon.svelte';

	import type { GuessLetterStatus } from '$lib';

	// Props
	//
	export let isFocused: boolean = false;
	export let isShaked: boolean = false;
	export let isRevealed: boolean = false;
	export let order: number = 1;
	export let status: GuessLetterStatus = 'idle';
	export let value: string = '';

	let backgroundStyle = 'bg-stone-900';
	let borderStyle = '';

	$: switch (status) {
		case 'correct':
			backgroundStyle = 'bg-emerald-800';
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
	class={clsx('| root', '| relative w-full h-full', isShaked ? '| shaked' : '')}
	class:revealed={isRevealed}
	style={`--animation-order: ${order}`}
>
	<!-- Front -->
	<div
		class={clsx(
			'| box front',
			'| w-full h-full',
			'| flex justify-center items-center',
			`| bg-stone-900 border uppercase text-neutral-100 text-2xl xxs:text-3xl xs:text-4xl uppercase`,
			isFocused ? 'border-dashed border-neutral-300' : 'border-neutral-700'
		)}
	>
		{value}
	</div>

	<!-- Back -->
	<div
		class={clsx(
			'| box box-back',
			'| w-full h-full',
			'| flex justify-center items-center',
			`| ${backgroundStyle} ${borderStyle} uppercase text-neutral-100 text-2xl xxs:text-3xl xs:text-4xl uppercase`
		)}
	>
		<span class="absolute bottom-0 left-0 | w-3 xxs:w-4 xs:w-5 h-3 xxs:h-4 xs:h-5 text-neutral-400">
			{#if status === 'correct'}
				<span class="sr-only">Benar</span>
				<CheckIcon />
			{:else if status === 'misplaced'}
				<span class="sr-only">Salah tempat</span>
				<CircleIcon />
			{:else if status === 'wrong'}
				<span class="sr-only">Salah</span>
				<XmarkIcon />
			{/if}
		</span>
		{value}
	</div>
</div>

<style>
	.root {
		transform-style: preserve-3d;
		transition: transform 0.8s;
		transition-delay: calc(var(--animation-order) * 200ms);
	}
	.root.revealed {
		transform: rotateY(180deg);
	}
	.root.shaked {
		animation: shake 0.25s;
		animation-iteration-count: infinite;
	}

	.box::before {
		content: '';
		padding-bottom: 100%;
		display: block;
	}
	.box.box-front,
	.box.box-back {
		position: absolute;
		top: 0;
		-webkit-backface-visibility: hidden;
		backface-visibility: hidden;
	}
	.box.box-back {
		transform: rotateY(180deg);
	}

	@keyframes shake {
		0% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(-4px);
		}
		75% {
			transform: translateX(4px);
		}
		100% {
			transform: translateX(0);
		}
	}
</style>
