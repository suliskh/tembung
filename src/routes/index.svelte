<script context="module" lang="ts">
	export function checkGuessBoxFocus(
		letterIndex: number,
		answerLength: number,
		word: string,
		isRevealed: boolean
	): boolean {
		let isLastIndex = letterIndex === answerLength - 1;
		let isFull = word.length >= answerLength;
		let isToBeFill = letterIndex === word.length;

		return isToBeFill || (isLastIndex && !isRevealed && isFull);
	}

	export function checkGuessBoxStatus(
		letterIndex: number,
		letter: string,
		answer: string,
		isRevealed: boolean
	): GuessLetterStatus {
		let status: GuessLetterStatus = 'idle';

		if (isRevealed) {
			let normalizedAnswer = answer.toUpperCase();
			let isLetterInAnswer = normalizedAnswer.includes(letter);

			if (isLetterInAnswer) {
				let isSamePos = letter === normalizedAnswer[letterIndex];
				status = isSamePos ? 'correct' : 'misplaced';
			} else {
				status = 'wrong';
			}
		}

		return status;
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	import GuessBox from '../components/GuessBox.svelte';
	import Modal from '../components/Modal.svelte';
	import { ToastContainer } from '../components/Toast';

	import { GuessLetterStatus, MAX_ATTEMPT } from '$lib';

	// States
	//
	let quizzes = [
		{
			question: 'Satu, dua, tiga, ...',
			answer: 'empat',
			img: 'https://cdn.pixabay.com/photo/2016/02/08/12/25/number-1186417_960_720.png'
		},
		{
			question: 'Salah satu anggota di Tim Ruangkelas?',
			answer: 'guntur',
			img: 'https://media-exp1.licdn.com/dms/image/C4E03AQHallzvAcPqxg/profile-displayphoto-shrink_800_800/0/1517057406296?e=1654128000&v=beta&t=PsTIMJLUS96TR2_RiLLjXceWQ-pPovrHqh8Tj7ou_RM'
		},
		{
			question: 'Kaka dan Bimbim adalah nama personel yang di...',
			answer: 'ulang',
			img: 'https://lingopolo.org/thai/sites/lingopolo.org.thai/files/styles/entry/public/images/2015/11/02/repeat.jpg'
		},
		{
			question: 'Penjara akan sangat berbahaya jika para napinya...',
			answer: 'batuk',
			img: 'https://akcdn.detik.net.id/visual/2019/04/21/f40154d1-133a-4aec-a7c7-5cf2111f2f4d_169.jpeg?w=650'
		},
		{
			question: 'Seorang pejabat akan terkena masalah apabila tersangkut...',
			answer: 'jemuran',
			img: 'https://img.okezone.com/content/2011/11/25/214/534010/KnUKHrMwcy.jpg'
		},
		{
			question: '"B" adalah tanda untuk kendaraan yang berasal dari...',
			answer: 'alfabet',
			img: 'https://risetcdn.jatimtimes.com/images/2021/07/07/Alfabet-Foto-Infia.co-Pe4fb5dc60e437db5.md.jpg'
		},
		{
			question: 'Bulan dan bintang bisa dilihat di...',
			answer: 'Malang',
			img: 'https://sites.google.com/site/dutchskies/_/rsrc/1231374345208/general/filecabinet/Moon_Venus_Saturn_20070618_2157_web.jpg?width=100%25'
		},
		{
			question: 'Selain motor, truk, dan bis, di jalan raya juga ada... ',
			answer: '-----',
			img: 'https://t-3.tstatic.net/jualbeli/img/njajal/2019/6/Agar-Mudik-Bebas-Tilang--Kenali-Marka-Jalan-Beserta-Fungsinya-master-1945893826.jpg'
		}
	];
	let guesses = [{ word: '', isRevealed: false }];
	let isAnswerModalOpen = false;
	let isWarningModalOpen = false;

	let currentQuizIndex = 0;
	let currentAttempt = 0;
	$: currentAnswer = quizzes[currentQuizIndex].answer;

	$: console.log(guesses);

	let appendLetterToCurrentGuess = (letter) => {
		let isCurrentAttemptFull = guesses[currentAttempt].word.length >= currentAnswer.length;

		if (!isCurrentAttemptFull) {
			guesses[currentAttempt].word = guesses[currentAttempt].word.concat(letter);
		}
	};

	let removeLastLetterFromCurrentGuess = () => {
		let currentGuessWord = guesses[currentAttempt].word;
		guesses[currentAttempt].word = currentGuessWord.substring(0, currentGuessWord.length - 1);
	};

	let revealCurrentGuess = () => {
		let isCurrentAttemptFull = guesses[currentAttempt].word.length >= currentAnswer.length;

		if (isCurrentAttemptFull) {
			guesses[currentAttempt].isRevealed = true;
			if (currentAttempt < MAX_ATTEMPT - 1) {
				currentAttempt = currentAttempt + 1;
				guesses.push({ word: '', isRevealed: false });
			}
		}
	};

	onMount(() => {
		isWarningModalOpen = true;
		document.addEventListener('keydown', (e) => {
			if (e.code === 'Enter') {
				revealCurrentGuess();
			} else if (e.code === 'Backspace') {
				removeLastLetterFromCurrentGuess();
			} else {
				appendLetterToCurrentGuess(e.key.toUpperCase());
			}
		});
	});
</script>

<svelte:head>
	{#each quizzes as quiz}
		<link rel="preload" as="image" href={quiz.img} />
	{/each}
</svelte:head>
<div class="w-screen min-h-screen | bg-surface | font-sans">
	<main class="max-w-xl mx-auto | px-8">
		<div class="py-10">
			<p class="text-center text-neutral-500">{`${currentQuizIndex + 1}/${quizzes.length}`}</p>
			<p class="text-4xl italic text-center text-neutral-200">
				{quizzes[currentQuizIndex].question}
			</p>
		</div>
		<div class="flex justify-between mb-3">
			<button
				class="shrink-0 | py-2 px-3 rounded xs:rounded-lg bg-stone-600 shadow-button active:shadow-button-active text-sm xxs:text-lg text-neutral-100 active:text-neutral-300 uppercase"
				on:click={() => {
					isAnswerModalOpen = true;
				}}
			>
				Ungkap
			</button>

			<button
				class="shrink-0 | py-2 px-3 rounded xs:rounded-lg bg-stone-600 shadow-button active:shadow-button-active text-sm xxs:text-lg text-neutral-100 active:text-neutral-300 uppercase"
				on:click={() => {
					if (currentQuizIndex < quizzes.length - 1) {
						guesses = [{ word: '', isRevealed: false }];
						currentQuizIndex++;
					}
				}}
			>
				Selanjutnya
			</button>
		</div>

		<!-- Answer Boxes -->
		<div class="flex flex-col space-y-2">
			<!-- Guess Attempts -->
			{#each guesses as guess, guessIndex (guessIndex)}
				<div class="flex space-x-2">
					{#each Array(currentAnswer.length).fill(1) as _x, letterIndex (letterIndex)}
						<GuessBox
							isFocused={checkGuessBoxFocus(
								letterIndex,
								currentAnswer.length,
								guess.word,
								guess.isRevealed
							)}
							isRevealed={guess.isRevealed}
							order={letterIndex}
							status={checkGuessBoxStatus(
								letterIndex,
								guess.word[letterIndex],
								currentAnswer,
								guess.isRevealed
							)}
							value={guess.word[letterIndex] || ''}
						/>
					{/each}
				</div>
			{/each}

			<!-- Remaining -->
			{#if guesses.length < MAX_ATTEMPT}
				{#each Array(MAX_ATTEMPT - guesses.length).fill(1) as i}
					<div class="flex space-x-2">
						{#each Array(currentAnswer.length).fill(1) as _x}
							<GuessBox isFocused={false} status="idle" value="" />
						{/each}
					</div>
				{/each}
			{/if}
		</div>
	</main>

	<Modal
		isOpen={isAnswerModalOpen}
		title="Ungkap Jawaban"
		onClose={() => {
			isAnswerModalOpen = false;
		}}
	>
		<div class="px-3 py-4 | flex flex-col items-center">
			<p class="text-xl italic text-center text-neutral-400 mb-8">
				{quizzes[currentQuizIndex].question}
			</p>
			<img
				alt={quizzes[currentQuizIndex].answer.toUpperCase()}
				class="w-56 mb-4"
				src={quizzes[currentQuizIndex].img}
			/>
			<p
				class="text-xl text-center tracking-widest bg-emerald-900/20 rounded-md border-l-4 border-r-4 border-emerald-800 | py-2 px-5"
			>
				{quizzes[currentQuizIndex].answer.toUpperCase()}
			</p>
		</div>
	</Modal>
	<Modal
		isOpen={isWarningModalOpen}
		title="[!] Peringatan"
		onClose={() => {
			isWarningModalOpen = false;
		}}
	>
		<div class="px-3 py-4 | flex flex-col items-center">
			<p class="text-xl text-center text-neutral-400">
				Permainan ini dapat menyebabkan hipertensi, serangan jantung, dan gangguan emosi dan
				kejiwaan.
			</p>
		</div>
	</Modal>
</div>

<ToastContainer />
