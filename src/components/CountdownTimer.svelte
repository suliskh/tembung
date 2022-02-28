<script lang="ts">
	import { onDestroy } from 'svelte';

	// Props
	//
	export let duration: number;

	// States
	//
	let hour: string = '00';
	let minute: string = '00';
	let second: string = '00';

	let timer = setInterval(() => {
		if (duration > 0) {
			duration = duration - 1;

			let hourNumber = Math.floor(duration / 3600);
			hour = hourNumber < 10 ? '0' + hourNumber : String(hourNumber);

			let minuteNumber = Math.floor((duration - hourNumber * 3600) / 60);
			minute = minuteNumber < 10 ? '0' + minuteNumber : String(minuteNumber);

			let secondNumber = Math.floor(duration - (hourNumber * 3600 + minuteNumber * 60));
			second = secondNumber < 10 ? '0' + secondNumber : String(secondNumber);
		} else {
			clearInterval(timer);
		}
	}, 1000);

	onDestroy(() => {
		clearInterval(timer);
	});
</script>

<div class={$$props.class}>
	<span>{hour}</span>
	<span>:</span>
	<span>{minute}</span>
	<span>:</span>
	<span>{second}</span>
</div>
