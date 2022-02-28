import type { WordDetail } from './types';

export const SECRET_ENCRYPT_SHIFT: number = 7;
export const SECRET_ENCRYPT_SEPARATOR: string = '•';

export function encode(word: string, wordDetail: WordDetail, date: Date): string {
	let concantinatedString = [date.toISOString(), word, JSON.stringify(wordDetail)].join(
		SECRET_ENCRYPT_SEPARATOR
	);

	return concantinatedString
		.split('')
		.map((_char, i) => concantinatedString.charCodeAt(i) + SECRET_ENCRYPT_SHIFT)
		.map((code) => String.fromCharCode(code))
		.join('');
}

export function decode(encryptedString: string): {
	date: string;
	word: string;
	wordDetail: WordDetail;
} {
	const decryptedString = encryptedString
		.split('')
		.map((_char, i) => encryptedString.charCodeAt(i) - SECRET_ENCRYPT_SHIFT)
		.map((code) => String.fromCharCode(code))
		.join('');

	const [date, word, wordDetail] = decryptedString.split(SECRET_ENCRYPT_SEPARATOR);

	return {
		word,
		date,
		wordDetail: JSON.parse(wordDetail)
	};
}
