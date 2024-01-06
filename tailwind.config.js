/** @type {import('tailwindcss').Config} */
/*eslint-env node*/
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			animation: {
				gradient: 'gradient 30s linear infinite',
				shake: 'shake 0.5s ease-in-out 1',
			},
			keyframes: {
				gradient: {
					from: { 'background-position': '0%' },
					to: { 'background-position': '500%' },
				},
				shake: {
					'0%, 100%': { transform: 'translateX(0)' },
					'25%': { transform: 'translateX(-2.5px)' },
					'50%': { transform: 'translateX(2.5px)' },
					'75%': { transform: 'translateX(-1.25px)' },
				},
			},
			backgroundSize: {
				'200%': '200%',
				'500%': '500%',
				'1000%': '1000%',
			},
		},
	},
	plugins: [
		require('@catppuccin/tailwindcss')({
			prefix: 'ctp',
			defaultFlavour: 'mocha',
		}),
	],
};
