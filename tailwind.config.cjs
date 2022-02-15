module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			boxShadow: {
				button: '0px 3px 0px #292524',
				'button-active': 'inset 0px 0px 4px 2px rgba(44, 44, 44, 0.5)'
			},
			colors: {
				surface: '#1c1210'
			},
			screens: {
				xxs: '324px',
				xs: '480px'
			}
		}
	},
	plugins: []
};
