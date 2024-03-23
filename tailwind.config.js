/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
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
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				gradient: 'gradient 25s linear infinite',
				shake: 'shake 0.5s ease-in-out 1',
			},
			backgroundSize: {
				'200%': '200%',
				'500%': '500%',
				'1000%': '1000%',
			},
			// colors: {
			// 	'ctp-rosewater': '#f5e0dc',
			// 	'ctp-flamingo': '#f2cdcd',
			// 	'ctp-pink': '#f5c2e7',
			// 	'ctp-mauve': '#cba6f7',
			// 	'ctp-red': '#f38ba8',
			// 	'ctp-maroon': '#eba0ac',
			// 	'ctp-peach': '#fab387',
			// 	'ctp-yellow': '#f9e2af',
			// 	'ctp-green': '#a6e3a1',
			// 	'ctp-teal': '#94e2d5',
			// 	'ctp-sky': '#89dceb',
			// 	'ctp-sapphire': '#74c7ec',
			// 	'ctp-blue': '#89b4fa',
			// 	'ctp-lavender': '#b4befe',
			// 	'ctp-text': '#cdd6f4',
			// 	'ctp-subtext1': '#bac2de',
			// 	'ctp-subtext0': '#a6adc8',
			// 	'ctp-overlay2': '#9399b2',
			// 	'ctp-overlay1': '#7f849c',
			// 	'ctp-overlay0': '#6c7086',
			// 	'ctp-surface2': '#585b70',
			// 	'ctp-surface1': '#45475a',
			// 	'neutral-700': '#313244',
			// 	'ctp-base': '#1e1e2e',
			// 	'ctp-mantle': '#181825',
			// 	'ctp-crust': '#11111b',
			// },
		},
		plugins: [
			// require('@catppuccin/tailwindcss')({
			// 	prefix: '',
			// 	defaultFlavour: 'mocha',
			// }),
			require('tailwindcss-animate'),
		],
	},
};
