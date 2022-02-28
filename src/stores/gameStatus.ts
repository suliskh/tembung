import { writable } from 'svelte/store';

export type GameStatus = 'not-started' | 'playing' | 'finished';

export const gameStatusStore = writable<GameStatus>('not-started');
