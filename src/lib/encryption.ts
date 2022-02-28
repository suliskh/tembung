import type { WordDetail } from './types';

export const SECRET_ENCRYPT_SHIFT: number = 7;
export const SECRET_ENCRYPT_SEPARATOR: string = '•';

export function encode(word: string, wordDetail: WordDetail, prevDate: Date): string {
	let concantinatedString = [prevDate.toDateString(), word, JSON.stringify(wordDetail)].join(
		SECRET_ENCRYPT_SEPARATOR
	);

	return concantinatedString
		.split('')
		.map((_char, i) => concantinatedString.charCodeAt(i) + SECRET_ENCRYPT_SHIFT)
		.map((code) => String.fromCharCode(code))
		.join('');
}

export function decode(encryptedString: string): {
	prevDate: string;
	word: string;
	wordDetail: WordDetail;
} {
	const decryptedString = encryptedString
		.split('')
		.map((_char, i) => encryptedString.charCodeAt(i) - SECRET_ENCRYPT_SHIFT)
		.map((code) => String.fromCharCode(code))
		.join('');

	const [prevDate, word, wordDetail] = decryptedString.split(SECRET_ENCRYPT_SEPARATOR);

	return {
		prevDate,
		word,
		wordDetail: JSON.parse(wordDetail)
	};
}
