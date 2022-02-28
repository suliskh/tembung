<script lang="ts">
	import clsx from 'clsx';

	import type { GuessLetterStatus } from '$lib';

	// Props
	//
	export let isCustomWidth: boolean = false;
	export let style: string = '';
	export let status: GuessLetterStatus = 'idle';

	let backgroundStyle = '';
	let boxShadowStyle = 'shadow-button active:shadow-button-active';
	let textColorStyle = 'text-neutral-100 active:text-neutral-300';

	$: switch (status) {
		case 'correct':
			backgroundStyle = 'bg-emerald-800';
			break;
		case 'wrong':
			backgroundStyle = 'bg-stone-800';
			textColorStyle = 'text-neutral-500';
			boxShadowStyle = 'shadow-button-wrong active:shadow-button-active';
			break;
		case 'misplaced':
			backgroundStyle = 'bg-yellow-700';
			break;
		case 'idle':
			backgroundStyle = 'bg-stone-600';
			break;
	}
</script>

<button
	class={clsx(
		style,
		'| h-8 xxs:h-10 xs:h-12',
		!isCustomWidth && 'w-6 xxs:w-7 xs:w-9',
		`| rounded xs:rounded-lg ${backgroundStyle}  ${boxShadowStyle} text-sm xxs:text-lg xs:text-2xl ${textColorStyle} uppercase`
	)}
	type="button"
	on:click
>
	<slot />
</button>
