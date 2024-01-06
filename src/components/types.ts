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

interface WeatherApiResponse {
	coord: {
		lon: number;
		lat: number;
	};
	weather: {
		id: number;
		main: string;
		description: string;
		icon: string;
	}[];
	base: string;
	main: {
		temp: number;
		feels_like: number;
		temp_min: number;
		temp_max: number;
		pressure: number;
		humidity: number;
		sea_level: number;
		grnd_level: number;
	};
	visibility: number;
	wind: {
		speed: number;
		deg: number;
		gust: number;
	};
	rain?: {
		'1h': number;
	};
	clouds: {
		all: number;
	};
	dt: number;
	sys: {
		type: number;
		id: number;
		country: string;
		sunrise: number;
		sunset: number;
	};
	timezone: number;
	id: number;
	name: string;
	cod: number;
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
