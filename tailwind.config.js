/** @type {import('tailwindcss').Config} */
/*eslint-env node*/
module.exports = {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			animation: {
				gradient: 'gradient 30s linear infinite',
			},
			keyframes: {
				gradient: {
					from: { 'background-position': '0%' },
					to: { 'background-position': '500%' },
				},
			},
			backgroundSize: {
				'200%': '200%',
				'500%': '500%',
			},
		},
	},
	plugins: [
		require('@catppuccin/tailwindcss')({
			prefix: 'ctp',
			defaultFlavour: 'macchiato',
		}),
	],
};
