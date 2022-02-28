export type GuessLetterStatus = 'idle' | 'correct' | 'misplaced' | 'wrong';

export type GuessAttempt = {
	isRevealed: boolean;
	statuses: Array<GuessLetterStatus>;
	word: string;
};

export type KeypadLetter = {
	letter: string;
	status: GuessLetterStatus;
};

export type WordDetail = {
	indonesianTranslation: string;
	phoneticTranscription: string;
	types: Array<string>;
	word: string;
};

export type GameStatus = 'playing' | 'answered-wrong' | 'answered-correct';
