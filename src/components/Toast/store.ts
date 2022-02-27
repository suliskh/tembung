import { writable } from 'svelte/store';

function createToastStore() {
	const { subscribe, update } = writable([]);

	return {
		subscribe,
		push: (newToast: string) => update((currentToasts) => [...currentToasts, newToast])
	};
}

export default createToastStore();
