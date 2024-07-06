import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';
import path from 'path';

const pwaConfig: Partial<VitePWAOptions> = {
	registerType: 'autoUpdate',
	includeAssets: ['*'],
	manifest: {
		short_name: 'Homepage',
		name: 'New Tab',
		icons: [
			{
				src: '/icon.png',
				type: 'image/png',
				sizes: '192x192',
			},
			{
				src: '/icon.png',
				type: 'image/png',
				sizes: '512x512',
			},
			{
				src: '/maskable_icon.png',
				type: 'image/png',
				sizes: '418x418',
				purpose: 'any maskable',
			},
		],
		id: '/?source=pwa',
		start_url: '/?source=pwa',
		background_color: '#1e1e2e',
		display: 'standalone',
		scope: '/',
		theme_color: '#1e1e2e',
	},
};

export default defineConfig(({ command, mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		define: {
			'process.env.WEATHER_KEY': JSON.stringify(env.WEATHER_KEY),
			'process.env.SPOTIFY_CLIENT_ID': JSON.stringify(env.SPOTIFY_CLIENT_ID),
			'process.env.CALLBACK_URL': JSON.stringify(env.CALLBACK_URL),
			'process.env.BACKEND_URL': JSON.stringify(env.BACKEND_URL),
		},
		plugins: [react(), VitePWA(pwaConfig)],
		server: {
			watch: {
				usePolling: true,
			},
		},
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
			},
		},
	};
});
