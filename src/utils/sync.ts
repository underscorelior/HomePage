type DBUser = {
	code: string | null;
	countdown: JSON | null;
	created_at: string;
	id: string | null;
	spotify: JSON | null;
	updated_at: string | null;
	weather: JSON | null;
};

export async function handleCreate(): Promise<string> {
	const res = await fetch(`${process.env.BACKEND_URL}/api/sync/create`, {
		method: 'GET',
	});

	const out = await res.json();

	if (res.status == 200) return out.code;
	else return 'An error has occurred' + out.message;
}

export async function handleUpdate(code: string, data?: DBUser | object) {
	if (!data) {
		data = exportData();
	}

	const res = await fetch(
		`${process.env.BACKEND_URL}/api/sync/update?code=${code}&data=${JSON.stringify(data)}`,
		{
			method: 'POST',
		},
	);

	const out = await res.json();

	if (res.status == 200) return out.message;
	else return 'An error has occurred' + out.message;
}

export async function handleGet(code: string): Promise<UserData | string> {
	const res = await fetch(
		`${process.env.BACKEND_URL}/api/sync/get?code=${code}`,
		{
			method: 'POST',
		},
	);

	const out = await res.json();
	if (res.status == 200) return out;
	else return 'An error has occurred' + out.message;
}

export function exportData() {
	const countdown: { countdowns?: Countdown[]; enabled?: boolean } = {};
	if (localStorage.getItem('is_countdown')) {
		countdown.enabled = localStorage.getItem('is_countdown') === 'true';
	}
	if (localStorage.getItem('countdowns')) {
		countdown.countdowns = JSON.parse(
			localStorage.getItem('countdowns') || '[]',
		);
	}

	const weather: { unit?: 'f' | 'c'; enabled?: boolean } = {};
	if (localStorage.getItem('is_weather')) {
		weather.enabled = localStorage.getItem('is_weather') === 'true';
	}
	if (localStorage.getItem('unit')) {
		weather.unit = (localStorage.getItem('unit') as 'f' | 'c') || 'f';
	}

	const spotify: { enabled?: boolean } = {};
	if (localStorage.getItem('is_spotify')) {
		spotify.enabled = localStorage.getItem('is_spotify') === 'true';
	}

	let theme: 'dark' | 'light' = 'light';
	if (
		localStorage.getItem('theme') === 'dark' ||
		localStorage.getItem('theme') === 'light'
	) {
		theme = localStorage.getItem('theme') as 'dark' | 'light';
	}

	const out = { countdown, weather, spotify, theme };

	return out;
}

export async function updateData(code?: string, data?: UserData) {
	if (!data && code) {
		data = JSON.parse(JSON.stringify(await handleGet(code)));
	}

	if (data) {
		localStorage.setItem('is_countdown', data.countdown.enabled + '');
		localStorage.setItem(
			'countdowns',
			JSON.stringify(data.countdown.countdowns),
		);

		localStorage.setItem('is_weather', data.weather.enabled + '');
		localStorage.setItem('unit', data.weather.unit);

		localStorage.setItem('is_spotify', data.spotify.enabled + '');

		localStorage.setItem('theme', data.theme);
	}
}
