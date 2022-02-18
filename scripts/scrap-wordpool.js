import fetch from 'node-fetch';
import { JSDOM } from 'jsdom';
import fs from 'fs';
import path from 'path';

export const WORDPOOL_URL =
	'https://id.wiktionary.org/wiki/Lampiran:Kamus_bahasa_Jawa_%E2%80%93_bahasa_Indonesia';

(async function () {
	const response = await fetch(WORDPOOL_URL);
	const body = await response.text();
	const dom = new JSDOM(body);

	const document = dom.window.document;
	const wordElms = document.querySelectorAll('.mw-parser-output div ul li > a');

	let wordsSet = new Set();
	for (let elm of wordElms) {
		let word = elm.innerHTML?.trim();
		if (word && word.length === 5) {
			// Remove accents
			let normalizedWord = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			wordsSet.add(normalizedWord);
		}
	}

	let words = [];
	for (const word of wordsSet) {
		words.push(word);
	}

	try {
		const wordpoolPath = path.join(process.cwd(), 'data/wordpool.json');
		fs.writeFileSync(wordpoolPath, JSON.stringify(words));

		console.log('Successfully written the words in data/wordpool.json. Total words:', words.length);
	} catch (err) {
		console.error(err);
	}
})();
