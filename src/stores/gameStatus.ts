import { writable } from 'svelte/store';

import type { GameStatus } from '$lib';

export const gameStatusStore = writable<GameStatus>('playing');
