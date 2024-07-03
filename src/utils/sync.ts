// TODO: Allow for customization of backend URL

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
	const res = await fetch(
		'https://homepage-backend-seven.vercel.app/api/sync/create',
		{
			method: 'GET',
		},
	);

	const out = await res.json();

	if (res.status == 200) return out.code;
	else return 'An error has occurred' + out.message;
}

export async function handleUpdate(code: string, data: DBUser) {
	const res = await fetch(
		'https://homepage-backend-seven.vercel.app/api/sync/update',
		{
			method: 'GET',
			body: JSON.stringify({ code: code, data: JSON.stringify(data) }),
		},
	);

	const out = await res.json();

	if (res.status == 200) return out.message;
	else return 'An error has occurred' + out.message;
}

export async function handleGet(code: string): Promise<UserData | string> {
	const res = await fetch(
		'https://homepage-backend-seven.vercel.app/api/sync/get',
		{
			method: 'GET',
			body: JSON.stringify({ code: code }),
		},
	);

	const out = await res.json();

	if (res.status == 200) return out.code;
	else return 'An error has occurred' + out.message;
}
