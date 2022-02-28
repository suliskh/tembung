export type GuessLetterStatus = 'idle' | 'correct' | 'misplaced' | 'wrong';

export type GuessAttempt = {
	isRevealed: boolean;
	statuses: Array<GuessLetterStatus>;
	word: string;
};

export type KeypadLetterStatus = 'correct' | 'disabled' | 'misplaced' | 'normal';

export type KeypadLetter = {
	letter: string;
	status: KeypadLetterStatus;
};

export type WordDetail = {
	indonesianTranslation: string;
	phoneticTranscription: string;
	types: Array<string>;
	word: string;
};
