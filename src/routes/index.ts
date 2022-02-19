import fs from 'fs';
import path from 'path';

import { encode } from '$lib/encryption';

export async function get() {
	let encryptedAnswer: string = '';
	let wordpool: Array<string> = [];

	try {
		const wordpoolPath = path.join(process.cwd(), 'data/wordpool.json');
		const wordpoolData = fs.readFileSync(wordpoolPath, 'utf8');
		wordpool = JSON.parse(wordpoolData);

		const answersPath = path.join(process.cwd(), 'data/answers.json');
		const answersData = fs.readFileSync(answersPath, 'utf8');
		const answers = JSON.parse(answersData);
		const currentAnswer = answers[answers.length - 1];
		encryptedAnswer = encode(currentAnswer);
	} catch (err) {
		console.error(err);
	}

	return {
		body: { encryptedAnswer: 'YW5nZWw=', wordpool: ['angon', 'angob', 'dalan', 'aspal', 'eling'] }
	};
}
