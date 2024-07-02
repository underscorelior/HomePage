// TODO: Allow for customization of backend URL

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

export function handleUpdate() {}

export function handleGet() {}
