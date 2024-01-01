declare module 'virtual:pwa-register' {
	import type { RegisterSWOptions } from 'vite-plugin-pwa/types';

	export type { RegisterSWOptions };

	export function registerSW(
		options?: RegisterSWOptions,
	): (reloadPage?: boolean) => Promise<void>;
}

interface UserProfile {
	country: string;
	display_name: string;
	email: string;
	explicit_content: {
		filter_enabled: boolean;
		filter_locked: boolean;
	};
	external_urls: { spotify: string };
	followers: { href: string; total: number };
	href: string;
	id: string;
	images: Image[];
	product: string;
	type: string;
	uri: string;
}

interface Image {
	url: string;
	height: number;
	width: number;
}

interface CurrentlyPlaying {
	device: {
		id: string | null;
		is_active: boolean;
		is_private_session: boolean;
		is_restricted: boolean;
		name: string;
		type: string;
		volume_percent: number | null;
		supports_volume: boolean;
		repeat_state: string;
		shuffle_state: boolean;
	};
	context: {
		type: string;
		href: string;
		external_urls: {
			spotify: string;
		};
		uri: string;
	} | null;
	timestamp: number;
	progress_ms: number;
	is_playing: boolean;
	item: TrackObject;
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

interface Device {
	id: string;
	is_active: boolean;
	is_private_session: boolean;
	is_restricted: boolean;
	name: string;
	type: string;
	volume_percent: number;
}

interface RecentlyPlayed {
	items: [
		{
			track: TrackObject;
		},
	];
}
