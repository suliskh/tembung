module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		fontFamily: {
			sans: ['Atkinson Hyperlegible', 'sans-serif']
		},
		extend: {
			boxShadow: {
				button: '0px 3px 0px #292524',
				'button-wrong': '0px 3px 0px #1c1917',
				'button-active': 'inset 0px 0px 4px 2px rgba(44, 44, 44, 0.5)'
			},
			colors: {
				surface: '#1c1210'
			},
			screens: {
				xxs: '324px',
				xs: '480px'
			},
			width: {
				em: '1em'
			},
			zIndex: {
				modal: 1300,
				toast: 1400
			}
		}
	},
	plugins: []
};
