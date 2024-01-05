declare module 'virtual:pwa-register' {
	import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

	export type { RegisterSWOptions };

	export function registerSW(
		options?: RegisterSWOptions,
	): (reloadPage?: boolean) => Promise<void>;
}

interface Image {
	url: string;
	height: number;
	width: number;
}

interface TrackObject {
	album: {
		href: string;
		images: Image[];
		name: string;
	};
	artists: {
		href: string;
		name: string;
	}[];
	available_markets: string[];
	disc_number: number;
	duration_ms: number;
	explicit: boolean;
	external_ids: {
		isrc: string;
		ean: string;
		upc: string;
	};
	external_urls: {
		href: string;
	};
	id: string;
	is_playable: boolean;
	linked_from: {
		href: string;
	} | null;
	restrictions: {
		name: string;
	} | null;
	name: string;
	popularity: number;
	preview_url: string;
	track_number: number;
	type: 'track';
	uri: string;
	is_local: boolean;
}
