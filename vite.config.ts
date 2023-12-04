import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA, VitePWAOptions } from 'vite-plugin-pwa';

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

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), VitePWA(pwaConfig)],
	server: {
		watch: {
			usePolling: true,
		},
	},
});
