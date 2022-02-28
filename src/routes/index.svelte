<script lang="ts">
	import { onDestroy, onMount } from 'svelte';

	import CountdownTimer from '../components/CountdownTimer.svelte';
	import GuessBox from '../components/GuessBox.svelte';
	import KeypadButton from '../components/KeypadButton.svelte';
	import Modal from '../components/Modal.svelte';
	import Note from '../components/Note.svelte';
	import { ToastContainer } from '../components/Toast';
	import DeleteIcon from '../icons/DeleteIcon.svelte';
	import ReturnIcon from '../icons/ReturnIcon.svelte';

	import {
		checkFocus,
		decode,
		getSecondsToTomorrow,
		KeypadLetter,
		KeypadLetterStatus,
		MAX_ATTEMPT,
		VALID_LETTERS,
		WORD_LENGTH
	} from '$lib';
	import { animateWrongGuessStore, gameStatusStore, guessAttemptsStore } from '../stores';

	// Props
	//
	export let encryptedAnswer: string = '';
	export let wordpool: Array<string> = [];

	// States
	//
	let animateWrongGuessTimer = null;
	let modalType: 'no-modal' | 'statistic-modal' | 'info-modal' = 'no-modal';
	let { date, word: answer, wordDetail } = decode(encryptedAnswer);

	$: {
		if ($gameStatusStore === 'answered-correct' || $gameStatusStore === 'answered-wrong') {
			modalType = 'statistic-modal';
		}
	}

	const unsubscribeAnimateWrongGuessStore = animateWrongGuessStore.subscribe(
		(animateWrongGuess) => {
			if (animateWrongGuess) {
				clearTimeout(animateWrongGuessTimer);
				setTimeout(() => animateWrongGuessStore.update(() => false), 1000);
			}
		}
	);

	onDestroy(unsubscribeAnimateWrongGuessStore);

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

	let revealCurrentGuess = () => {
		if (
			modalType === 'no-modal' &&
			$gameStatusStore !== 'answered-correct' &&
			$gameStatusStore !== 'answered-wrong'
		) {
			guessAttemptsStore.revealCurrentGuess(answer, wordpool);
		}
	};

	let appendLetterToCurrentGuess = (letter: string) => {
		if (
			modalType === 'no-modal' &&
			$gameStatusStore !== 'answered-correct' &&
			$gameStatusStore !== 'answered-wrong'
		) {
			guessAttemptsStore.appendLetterToCurrentGuess(letter.toLowerCase());
		}
	};

	let removeLastLetterFromCurrentGuess = () => {
		if (
			modalType === 'no-modal' &&
			$gameStatusStore !== 'answered-correct' &&
			$gameStatusStore !== 'answered-wrong'
		) {
			guessAttemptsStore.removeLastLetterFromCurrentGuess();
		}
	};

	onMount(() => {
		guessAttemptsStore.revealAllGuess(answer);
		revealKeypadLetterStatus();

		document.addEventListener('keydown', (e) => {
			if (e.code === 'Enter') {
				revealCurrentGuess();
				revealKeypadLetterStatus();
			} else if (e.code === 'Backspace') {
				removeLastLetterFromCurrentGuess();
			} else {
				appendLetterToCurrentGuess(e.key);
			}
		});
	});
</script>

<div class="w-screen min-h-screen | bg-surface | font-sans">
	<main class="max-w-lg mx-auto | px-8">
		<!-- Answer Boxes -->
		<div class="answer-container | grid gap-2 grid-cols-5 grid-rows-6 | mb-8">
			<!-- Guess Attempts -->
			{#each $guessAttemptsStore as attempt, guessIndex (guessIndex)}
				<div class="contents">
					{#each Array(WORD_LENGTH).fill(1) as _x, letterIndex (letterIndex)}
						<GuessBox
							isShaked={guessIndex === $guessAttemptsStore.length - 1 && $animateWrongGuessStore}
							isFocused={checkFocus(letterIndex, attempt.word, attempt.isRevealed)}
							isRevealed={attempt.isRevealed}
							order={letterIndex}
							status={attempt.statuses[letterIndex]}
							value={attempt.word[letterIndex] || ''}
						/>
					{/each}
				</div>
			{/each}

			<!-- Remaining -->
			{#if $guessAttemptsStore.length < MAX_ATTEMPT}
				{#each Array(MAX_ATTEMPT - $guessAttemptsStore.length).fill(1) as i}
					<div class="contents">
						{#each Array(WORD_LENGTH).fill(1) as _x}
							<GuessBox isFocused={false} status="idle" value="" />
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
						on:click={() => appendLetterToCurrentGuess(keypadLetter.letter)}
					>
						{keypadLetter.letter}
					</KeypadButton>
				{/each}
			</div>
			<div class="flex justify-center | space-x-1 xs:space-x-2">
				{#each keypadLetters.slice(10, 19) as keypadLetter, i (i)}
					<KeypadButton
						style="shrink-0"
						status={keypadLetter.status}
						on:click={() => appendLetterToCurrentGuess(keypadLetter.letter)}
					>
						{keypadLetter.letter}
					</KeypadButton>
				{/each}
			</div>
			<div class="flex justify-center | space-x-1 xs:space-x-2">
				<KeypadButton
					isCustomWidth
					style="flex items-center justify-center shrink-0 | w-10 xxs:w-11 xs:w-14"
					on:click={removeLastLetterFromCurrentGuess}
				>
					<span class="w-em"><DeleteIcon /></span>
					<span class="sr-only">Hapus</span>
				</KeypadButton>
				{#each keypadLetters.slice(19, 26) as keypadLetter, i (i)}
					<KeypadButton
						style="shrink-0"
						status={keypadLetter.status}
						on:click={() => appendLetterToCurrentGuess(keypadLetter.letter)}
					>
						{keypadLetter.letter}
					</KeypadButton>
				{/each}
				<KeypadButton
					isCustomWidth
					style="flex items-center justify-center shrink-0 | w-10 xxs:w-11 xs:w-14"
					on:click={() => {
						revealKeypadLetterStatus();
						revealCurrentGuess();
					}}
				>
					<span class="w-em"><ReturnIcon /></span>
					<span class="sr-only">Ok</span>
				</KeypadButton>
			</div>
		</div>
	</main>

	<Modal
		isOpen={modalType === 'statistic-modal'}
		title="Statistik"
		onClose={() => {
			modalType = 'no-modal';
		}}
	>
		<div class="px-3 py-4 space-y-4 | border-b border-neutral-700">
			{#if $gameStatusStore === 'answered-correct'}
				<Note variant="success">Mantap! Bedhekanmu bener</Note>
				<div class="mt-4">
					<p class="font-bold text-2xl">{answer}</p>
					{#if wordDetail.phoneticTranscription || wordDetail.types?.length > 0}
						<p class="text-sm text-neutral-400 | mb-2">
							{`/${wordDetail.phoneticTranscription}/ • ${wordDetail.types.join(', ')}`}
						</p>
					{/if}
					<p class="text-base text-neutral-200">{wordDetail.indonesianTranslation}</p>
				</div>
			{/if}

			{#if $gameStatusStore === 'answered-wrong'}
				<Note variant="danger">Jancuk! Bedhekanmu salah!!!</Note>
			{/if}
		</div>
		<div class="px-3 py-4">
			<p class="text-neutral-300">Bedhekan selanjute bakal dibagikaken ing:</p>
			<CountdownTimer class="text-2xl" duration={getSecondsToTomorrow(date)} />
		</div>
	</Modal>
</div>

<ToastContainer />
