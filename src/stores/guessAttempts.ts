import { writable } from 'svelte/store';

import { getGuessStatuses, GuessAttempt, MAX_ATTEMPT, VALID_LETTERS, WORD_LENGTH } from '$lib';

const EMPTY_GUESS_ATTEMPT: GuessAttempt = {
	isRevealed: false,
	statuses: [],
	word: ''
};

function createGuessAttemptsStore() {
	const { subscribe, set, update } = writable<Array<GuessAttempt>>([EMPTY_GUESS_ATTEMPT]);

	return {
		subscribe,
		appendLetterToCurrentGuess: (letter: string) =>
			/**
			 * If the letter is valid and the current guess is not completed
			 * Append the letter to the current guess
			 */

			update((guessAttempts: Array<GuessAttempt>) => {
				let currentIndex = guessAttempts.length - 1;
				let currentGuess = guessAttempts[currentIndex];
				let isCurrentGuessComplete = currentGuess?.word?.length >= WORD_LENGTH;
				let isValidLetter = VALID_LETTERS.flat().join('').includes(letter);

				if (!isCurrentGuessComplete && isValidLetter) {
					guessAttempts[currentIndex] = {
						...currentGuess,
						word: currentGuess.word + letter
					};
				}

				return guessAttempts;
			}),
		removeLastLetterFromCurrentGuess: () =>
			/**
			 * Remove the last letter from the current guess
			 */

			update((guessAttempts: Array<GuessAttempt>) => {
				let currentIndex = guessAttempts.length - 1;
				let currentGuess = guessAttempts[currentIndex];

				guessAttempts[currentIndex] = {
					...currentGuess,
					word: currentGuess.word.slice(0, -1)
				};

				return guessAttempts;
			}),
		revealAllGuess: (answer: string) =>
			/**
			 * Set isRevealed to true for all completed guesses
			 */

			update((guessAttempts: Array<GuessAttempt>) =>
				guessAttempts.map((guess) => ({
					...guess,
					isRevealed: guess.word.length === WORD_LENGTH ? true : false,
					statuses: getGuessStatuses(guess.word, answer)
				}))
			),
		revealCurrentGuess: (answer: string, wordpool: Array<string>) =>
			/**
			 * Check if the guess is a valid word (i.e. included in the wordpool)
			 * If true, reveal the guess and append an empty guess
			 * Otherwise, show error toast
			 */

			update((guessAttempts: Array<GuessAttempt>) => {
				let currentIndex = guessAttempts.length - 1;
				let currentGuess = guessAttempts[currentIndex];
				let isValidWord = wordpool.includes(currentGuess.word);

				if (isValidWord) {
					guessAttempts[currentIndex] = {
						...currentGuess,
						isRevealed: true,
						statuses: getGuessStatuses(currentGuess.word, answer)
					};

					if (guessAttempts.length < MAX_ATTEMPT) {
						guessAttempts = [...guessAttempts, EMPTY_GUESS_ATTEMPT];
					}
				} else {
					// TODO: show error toast
					console.log('Your guess is not in the wordpool');
				}

				return guessAttempts;
			}),
		reset: () => set([EMPTY_GUESS_ATTEMPT])
	};
}

export const guessAttemptsStore = createGuessAttemptsStore();
