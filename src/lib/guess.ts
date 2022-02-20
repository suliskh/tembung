import { WORD_LENGTH } from './constants';
import type { GuessLetterStatus } from './types';

export function checkFocus(letterIndex: number, word: string, isRevealed: boolean) {
	let isToBeFill = letterIndex === word.length;
	let isEmptyString = !Boolean(word[letterIndex]);
	let isLastIndex = letterIndex === WORD_LENGTH - 1;

	return isToBeFill || (isLastIndex && !isRevealed && !isEmptyString);
}

export function getGuessStatuses(guessWord: string, answer: string): Array<GuessLetterStatus> {
	const statuses = guessWord.split('').map((letter: string, i: number) => {
		let status: GuessLetterStatus = 'idle';
		let isIncluded = answer.includes(letter);
		let isCorrectPosition = letter === answer[i];

		if (isCorrectPosition) {
			status = 'correct';
		} else if (isIncluded) {
			status = 'misplaced';
		} else {
			status = 'wrong';
		}

		return status;
	});

	return statuses;
}

