import { writable } from 'svelte/store';

import {
	getGuessStatuses,
	GameStatus,
	GuessAttempt,
	MAX_ATTEMPT,
	VALID_LETTERS,
	WORD_LENGTH
} from '$lib';
import { toastStore } from '../components/Toast';
import { animateWrongGuessStore } from './animateWrongGuess';
import { gameStatusStore } from './gameStatus';

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
			 * [1] 	Check if the there is some guess that is equal to the answer.
			 * 		If true, set the gameStatus to `answered-correct`.
			 * 		If false and the attempts count is reaching the MAX_ATTEMPT,
			 * 		set the gameStatus to `answered-wrong`.
			 * 		Otherwise, set the gameStatus to `playing`.
			 *
			 * [2] 	Set isRevealed to true for all completed guesses
			 */
			{
				update((guessAttempts: Array<GuessAttempt>) => {
					// [1]
					//
					let isAnyCorrectAnswers = guessAttempts.some((guess) => guess.word === answer);
					let newGameStatus: GameStatus = 'playing';

					if (isAnyCorrectAnswers) {
						newGameStatus = 'answered-correct';
					} else if (guessAttempts.length >= MAX_ATTEMPT) {
						newGameStatus = 'answered-wrong';
					}
					gameStatusStore.update(() => newGameStatus);

					// [2]
					//
					return guessAttempts.map((guess) => {
						return {
							...guess,
							isRevealed: guess.word.length === WORD_LENGTH ? true : false,
							statuses: getGuessStatuses(guess.word, answer)
						};
					});
				});
			},
		revealCurrentGuess: (answer: string, wordpool: Array<string>) =>
			/**
			 * [1] 	Check if the current guess is equal to the answer.
			 * 		If true, set the gameStatus to `answered-correct`.
			 * 		If false and the attempts count is reaching the MAX_ATTEMPT,
			 * 		set the gameStatus to `answered-wrong`.
			 * 		Otherwise, set the gameStatus to `playing`.
			 *
			 * [2] 	Check if the guess is a valid word (i.e. included in the wordpool).
			 * 		If true, reveal the guess and append an empty guess.
			 * 		Otherwise, show error toast and animate the current guess boxes.
			 */
			{
				update((guessAttempts: Array<GuessAttempt>) => {
					let currentIndex = guessAttempts.length - 1;
					let currentGuess = guessAttempts[currentIndex];

					// [1]
					//
					let isAnyCorrectAnswers = currentGuess.word === answer;
					let newGameStatus: GameStatus = 'playing';

					if (isAnyCorrectAnswers) {
						newGameStatus = 'answered-correct';
					} else if (guessAttempts.length >= MAX_ATTEMPT) {
						newGameStatus = 'answered-wrong';
					}
					gameStatusStore.update(() => newGameStatus);

					// [2]
					//
					let isValidWord = wordpool.includes(currentGuess.word);
					let isValidLength = currentGuess.word?.length === WORD_LENGTH;

					if (!isValidLength) {
						toastStore.push('Hurufmu kurang, Cuk!');
						animateWrongGuessStore.update(() => true);
					} else if (isValidWord) {
						guessAttempts[currentIndex] = {
							...currentGuess,
							isRevealed: true,
							statuses: getGuessStatuses(currentGuess.word, answer)
						};

						if (guessAttempts.length < MAX_ATTEMPT) {
							guessAttempts = [...guessAttempts, EMPTY_GUESS_ATTEMPT];
						}
					} else {
						toastStore.push('Salah, Cuk!');
						animateWrongGuessStore.update(() => true);
					}

					return guessAttempts;
				});
			},
		reset: () => set([EMPTY_GUESS_ATTEMPT])
	};
}

export const guessAttemptsStore = createGuessAttemptsStore();
