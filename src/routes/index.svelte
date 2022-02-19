<script lang="ts">
	import { onMount } from 'svelte';
	import { decode } from '../lib/encryption';
	import { MAX_ATTEMPT, VALID_LETTERS, WORD_LENGTH } from '$lib/constants';

	import AnswerBox, { AnswerBoxVariant } from '../components/AnswerBox.svelte';
	import KeypadButton, { KeypadButtonVariant } from '../components/KeypadButton.svelte';
	import DeleteIcon from '../icons/DeleteIcon.svelte';
	import ReturnIcon from '../icons/ReturnIcon.svelte';

	// Props
	//
	export let encryptedAnswer: string;
	export let wordpool: Array<string>;

	// States
	//
	let guesses: Array<string> = [];
	let currentGuess: string = '';
	$: answer = decode(encryptedAnswer);

	let getGuessedLetterVariant = (letter: string, index: number) => {
		let variant: AnswerBoxVariant = 'idle';

		let isIncluded = answer.includes(letter.toLowerCase());
		let isCorrect = letter.toLowerCase() === answer[index]?.toLowerCase();

		if (isCorrect) {
			variant = 'correct';
		} else if (!isCorrect && isIncluded) {
			variant = 'misplaced';
		} else if (!isCorrect && !isIncluded) {
			variant = 'wrong';
		}

		return variant;
	};

	let getCurrentGuessLetterVariant = (letter: string, i: number) => {
		let isLastLetter = i === WORD_LENGTH - 1 && !!letter;
		let isActive = i === currentGuess.length;

		return isActive || isLastLetter ? 'focused' : 'idle';
	};

	$: getButtonVariant = (letter: string): KeypadButtonVariant => {
		let variant: KeypadButtonVariant = 'normal';

		let indexOfLetter = answer.indexOf(letter.toLowerCase());
		let isInAnswer = indexOfLetter >= 0;
		let isInGuesses = guesses.join().toLowerCase().includes(letter.toLowerCase());

		if (isInGuesses && isInAnswer) {
			variant = 'misplaced';

			let isCorrect = guesses.some(
				(guess) => guess[indexOfLetter]?.toLowerCase() === letter.toLowerCase()
			);

			if (isCorrect) {
				variant = 'correct';
			}
		} else if (isInGuesses && !isInAnswer) {
			variant = 'disabled';
		}

		return variant;
	};

	let appendToAnswer = (letter: string) => {
		if (currentGuess.length < WORD_LENGTH) {
			currentGuess += letter;
		}
	};

	let popCurrentGuess = () => {
		if (currentGuess.length > 0) {
			currentGuess = currentGuess.substring(0, currentGuess.length - 1);
		}
	};

	let submitGuess = () => {
		if (currentGuess.length === WORD_LENGTH && guesses.length < MAX_ATTEMPT) {
			const isValidWord = wordpool.includes(currentGuess);

			if (isValidWord) {
				guesses = [...guesses, currentGuess];
				currentGuess = '';
			} else {
				// TODO: show toast
				console.log('NOT VALID');
			}
		}
	};

	onMount(() => {
		document.addEventListener('keydown', (e) => {
			let key = e.key.toLowerCase();

			if (VALID_LETTERS.flat().join('').includes(key)) {
				appendToAnswer(key);
			} else if (e.code === 'Enter') {
				submitGuess();
			} else if (e.code === 'Backspace') {
				popCurrentGuess();
			}
		});
	});
</script>

<div class="w-screen min-h-screen | bg-surface | font-sans">
	<header />
	<main class="max-w-lg mx-auto | px-8">
		<!-- Answer Boxes -->
		<div class="answer-container | grid gap-2 grid-cols-5 grid-rows-6 | mb-8">
			<!-- Guessed -->
			{#each guesses as guess, i (i)}
				<div class="contents">
					{#each Array(WORD_LENGTH).fill(1) as _x, j (j)}
						<AnswerBox value={guess[j]} variant={getGuessedLetterVariant(guess[j], j)} />
					{/each}
				</div>
			{/each}

			<!-- Current Guess -->
			{#if guesses.length < MAX_ATTEMPT}
				<div class="contents">
					{#each Array(WORD_LENGTH).fill(1) as _x, i (i)}
						<AnswerBox
							value={currentGuess[i] || ''}
							variant={getCurrentGuessLetterVariant(currentGuess[i], i)}
						/>
					{/each}
				</div>
				<!-- Remaining -->
				{#each Array(MAX_ATTEMPT - guesses.length - 1).fill(1) as _x, i (i)}
					<div class="contents">
						{#each Array(WORD_LENGTH).fill(1) as _x, j (j)}
							<AnswerBox value="" variant="idle" />
						{/each}
					</div>
				{/each}
			{/if}
		</div>

		<!-- Keypad -->
		<div class="space-y-2 xs:space-y-3">
			<div class="flex justify-center | space-x-1 xs:space-x-2">
				{#each VALID_LETTERS[0] as letter, i (letter)}
					<KeypadButton
						style="shrink-0"
						variant={getButtonVariant(letter)}
						on:click={() => appendToAnswer(letter)}>{letter}</KeypadButton
					>
				{/each}
			</div>
			<div class="flex justify-center | space-x-1 xs:space-x-2">
				{#each VALID_LETTERS[1] as letter, i (letter)}
					<KeypadButton
						style="shrink-0"
						variant={getButtonVariant(letter)}
						on:click={() => appendToAnswer(letter)}>{letter}</KeypadButton
					>
				{/each}
			</div>
			<div class="flex justify-center | space-x-1 xs:space-x-2">
				<KeypadButton
					isCustomWidth
					style="flex items-center justify-center shrink-0 | w-10 xxs:w-11 xs:w-14"
					on:click={() => popCurrentGuess()}
				>
					<span class="w-em"><DeleteIcon /></span>
					<span class="sr-only">Hapus</span>
				</KeypadButton>
				{#each VALID_LETTERS[2] as letter (letter)}
					<KeypadButton
						style="shrink-0"
						variant={getButtonVariant(letter)}
						on:click={() => appendToAnswer(letter)}>{letter}</KeypadButton
					>
				{/each}
				<KeypadButton
					isCustomWidth
					style="flex items-center justify-center shrink-0 | w-10 xxs:w-11 xs:w-14"
					on:click={() => submitGuess()}
				>
					<span class="w-em"><ReturnIcon /></span>
					<span class="sr-only">Ok</span>
				</KeypadButton>
			</div>
		</div>
	</main>
</div>
