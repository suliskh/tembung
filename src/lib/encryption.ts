export const SECRET_CODE = 123;

export function encode(str: string): string {
	return str
		.split('')
		.map((_char, i) => str.charCodeAt(i) + SECRET_CODE)
		.map((code) => String.fromCharCode(code))
		.join('');
}

export function decode(str: string): string {
	return str
		.split('')
		.map((_char, i) => str.charCodeAt(i) - SECRET_CODE)
		.map((code) => String.fromCharCode(code))
		.join('');
}
