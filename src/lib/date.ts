export function getSecondsToTomorrow(currentDate): number {
    let now = new Date(currentDate);
	let tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

	let diff = tomorrow.getTime() - now.getTime();

	return Math.round(diff / 1000);
}
