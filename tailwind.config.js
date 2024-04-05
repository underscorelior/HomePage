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
				gradient: 'gradient 50s linear infinite',
				shake: 'shake 0.5s ease-in-out 1',
			},
			backgroundSize: {
				'200%': '200%',
				'500%': '500%',
				'1000%': '1000%',
			},
		},
		plugins: [require('tailwindcss-animate')],
	},
};
