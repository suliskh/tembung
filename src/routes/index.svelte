<script lang="ts">
	import { onMount } from 'svelte';

	import AnswerBox from '../components/AnswerBox.svelte';
	import KeypadButton from '../components/KeypadButton.svelte';
	import DeleteIcon from '../icons/DeleteIcon.svelte';
	import ReturnIcon from '../icons/ReturnIcon.svelte';

	import {
		checkFocus,
		decode,
		KeypadLetter,
		KeypadLetterStatus,
		MAX_ATTEMPT,
		VALID_LETTERS,
		WORD_LENGTH
	} from '$lib';
	import { guessAttemptsStore } from '../stores';

	// Props
	//
	export let encryptedAnswer: string = '';
	export let wordpool: Array<string> = [];

	// States
	//
	$: answer = decode(encryptedAnswer);

	let keypadLetters: Array<KeypadLetter> = VALID_LETTERS.map((letter) => ({
		letter,
		status: 'normal'
	}));

	let revealKeypadLetterStatus = () => {
		let revealedKeypadLetters = new Map<string, KeypadLetterStatus>();

		$guessAttemptsStore.forEach((guessAttempt) => {
			guessAttempt.word.split('').forEach((letter, i) => {
				let isNormal = revealedKeypadLetters.get(letter) === 'normal';
				let isMisplaced = revealedKeypadLetters.get(letter) === 'misplaced';
				let isEmpty = !Boolean(revealedKeypadLetters.get(letter));

				if (isEmpty || isMisplaced || isNormal) {
					if (guessAttempt.statuses[i] === 'correct') {
						revealedKeypadLetters.set(letter, 'correct');
					} else if (guessAttempt.statuses[i] === 'wrong') {
						revealedKeypadLetters.set(letter, 'disabled');
					} else if (guessAttempt.statuses[i] === 'misplaced') {
						revealedKeypadLetters.set(letter, 'misplaced');
					}
				}
			});
		});

		keypadLetters = keypadLetters.map(({ letter, status }) => ({
			letter,
			status: revealedKeypadLetters.get(letter) || status
		}));
	};

	onMount(() => {
		guessAttemptsStore.revealAllGuess(answer);
		revealKeypadLetterStatus();

		document.addEventListener('keydown', (e) => {
			if (e.code === 'Enter') {
				guessAttemptsStore.revealCurrentGuess(answer, wordpool);
				revealKeypadLetterStatus();
			} else if (e.code === 'Backspace') {
				// TODO: pop letter from the current guess
				guessAttemptsStore.removeLastLetterFromCurrentGuess();
			} else {
				guessAttemptsStore.appendLetterToCurrentGuess(e.key.toLowerCase());
			}
		});
	});
</script>

<div class="w-screen min-h-screen | bg-surface | font-sans">
	<header />
	<main class="max-w-lg mx-auto | px-8">
		<!-- Answer Boxes -->
		<div class="answer-container | grid gap-2 grid-cols-5 grid-rows-6 | mb-8">
			<!-- Guess Attempts -->
			{#each $guessAttemptsStore as attempt, i (i)}
				<div class="contents">
					{#each Array(WORD_LENGTH).fill(1) as _x, letterIndex (letterIndex)}
						<AnswerBox
							isRevealed={attempt.isRevealed}
							order={letterIndex}
							status={attempt.statuses[letterIndex]}
							value={attempt.word[letterIndex] || ''}
							isFocused={checkFocus(letterIndex, attempt.word, attempt.isRevealed)}
						/>
					{/each}
				</div>
			{/each}

			<!-- Remaining -->
			{#if $guessAttemptsStore.length < MAX_ATTEMPT}
				{#each Array(MAX_ATTEMPT - $guessAttemptsStore.length).fill(1) as i}
					<div class="contents">
						{#each Array(WORD_LENGTH).fill(1) as _x}
							<AnswerBox status="idle" value="" isFocused={false} />
						{/each}
					</div>
				{/each}
			{/if}
		</div>

		<!-- Keypad -->
		<div class="space-y-2 xs:space-y-3">
			<div class="flex justify-center | space-x-1 xs:space-x-2">
				{#each keypadLetters.slice(0, 10) as keypadLetter, i (i)}
					<KeypadButton
						style="shrink-0"
						status={keypadLetter.status}
						on:click={() =>
							guessAttemptsStore.appendLetterToCurrentGuess(keypadLetter.letter.toLowerCase())}
						>{keypadLetter.letter}</KeypadButton
					>
				{/each}
			</div>
			<div class="flex justify-center | space-x-1 xs:space-x-2">
				{#each keypadLetters.slice(10, 19) as keypadLetter, i (i)}
					<KeypadButton
						style="shrink-0"
						status={keypadLetter.status}
						on:click={() =>
							guessAttemptsStore.appendLetterToCurrentGuess(keypadLetter.letter.toLowerCase())}
						>{keypadLetter.letter}</KeypadButton
					>
				{/each}
			</div>
			<div class="flex justify-center | space-x-1 xs:space-x-2">
				<KeypadButton
					isCustomWidth
					style="flex items-center justify-center shrink-0 | w-10 xxs:w-11 xs:w-14"
					on:click={() => guessAttemptsStore.removeLastLetterFromCurrentGuess()}
				>
					<span class="w-em"><DeleteIcon /></span>
					<span class="sr-only">Hapus</span>
				</KeypadButton>
				{#each keypadLetters.slice(19, 26) as keypadLetter, i (i)}
					<KeypadButton
						style="shrink-0"
						status={keypadLetter.status}
						on:click={() =>
							guessAttemptsStore.appendLetterToCurrentGuess(keypadLetter.letter.toLowerCase())}
						>{keypadLetter.letter}</KeypadButton
					>
				{/each}
				<KeypadButton
					isCustomWidth
					style="flex items-center justify-center shrink-0 | w-10 xxs:w-11 xs:w-14"
					on:click={() => guessAttemptsStore.revealCurrentGuess(answer, wordpool)}
				>
					<span class="w-em"><ReturnIcon /></span>
					<span class="sr-only">Ok</span>
				</KeypadButton>
			</div>
		</div>
	</main>
</div>
