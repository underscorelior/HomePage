import toast from 'react-hot-toast';

function generateCodeVerifier(length: number) {
	let text = '';
	const possible =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

	for (let i = 0; i < length; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

async function generateCodeChallenge(codeVerifier: string) {
	const data = new TextEncoder().encode(codeVerifier);
	const digest = await window.crypto.subtle.digest('SHA-256', data);
	return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
		.replace(/\+/g, '-')
		.replace(/\//g, '_')
		.replace(/=+$/, '');
}

export async function redirectToAuthCodeFlow(
	clientId: string,
	callbackUrl: string,
) {
	const verifier = generateCodeVerifier(128);
	const challenge = await generateCodeChallenge(verifier);

	localStorage.setItem('verifier', verifier);

	const params = new URLSearchParams();
	params.append('client_id', clientId);
	params.append('response_type', 'code');
	params.append('redirect_uri', callbackUrl + '/callback');
	params.append(
		'scope',
		'user-read-private user-read-email user-read-playback-state user-modify-playback-state user-read-currently-playing user-read-playback-position user-top-read user-read-recently-played user-library-read user-library-modify',
	);

	params.append('code_challenge_method', 'S256');
	params.append('code_challenge', challenge);

	document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
}

export const refreshToken = async (clientId: string, URL: string) => {
	const refreshToken = localStorage.getItem('refresh_token') || '';
	const url = 'https://accounts.spotify.com/api/token';

	const payload = {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
		},
		body: new URLSearchParams({
			grant_type: 'refresh_token',
			refresh_token: refreshToken,
			client_id: clientId,
		}),
	};
	const body = await fetch(url, payload);
	const response = await body.json();
	localStorage.setItem('access_token', response.access_token);
	localStorage.setItem('refresh_token', response.refresh_token);
	localStorage.setItem(
		'expires_in',
		(Date.now() + response.expires_in * 1000) as unknown as string,
	);

	window.location.href = URL;
};

export async function getAccessToken(
	clientId: string,
	code: string,
	URL: string,
) {
	const verifier = localStorage.getItem('verifier') || '';

	if (localStorage.getItem('access_token'))
		return localStorage.getItem('access_token');
	const params = new URLSearchParams();
	params.append('client_id', clientId);
	params.append('grant_type', 'authorization_code');
	params.append('code', code);
	params.append('redirect_uri', URL + '/callback');
	params.append('code_verifier', verifier);

	const result = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: params,
	});
	const { access_token, refresh_token, expires_in } = await result.json();
	localStorage.setItem('refresh_token', refresh_token);
	localStorage.setItem('access_token', access_token);
	localStorage.setItem(
		'expires_in',
		(Date.now() + ((expires_in || 0) as number) * 1000) as unknown as string,
	);
	window.location.href = URL;
	return access_token;
}

async function getActiveDeviceId(accessToken: string, type: number) {
	const result = await fetch('https://api.spotify.com/v1/me/player/devices', {
		method: 'GET',
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	const { devices } = await result.json();
	const activeDevice = devices.find((device: Device) => device.is_active);

	if (!activeDevice) {
		toast.error(
			`Failed to ${type == 1 ? 'play/pause' : type == 2 ? 'skip' : 'seek'}`,
			{
				style: {
					border: '1px solid #313244',
					padding: '16px',
					color: '#cdd6f4',
					backgroundColor: '#181825',
				},
				iconTheme: {
					primary: '#f38ba8',
					secondary: '#1e1e2e',
				},
			},
		);
		return false;
	}
	return activeDevice.id;
}

export async function fetchProfile(accessToken: string) {
	const result = await fetch('https://api.spotify.com/v1/me', {
		method: 'GET',
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	return await result.json();
}

export async function player(accessToken: string) {
	const result = await fetch('https://api.spotify.com/v1/me/player', {
		method: 'GET',
		headers: { Authorization: `Bearer ${accessToken}` },
	});

	if (result.status === 204) {
		const res = await fetch(
			'https://api.spotify.com/v1/me/player/recently-played?limit=1',
			{
				method: 'GET',
				headers: { Authorization: `Bearer ${accessToken}` },
			},
		);
		const rel = await res.json();
		return [rel.items[0].track, false];
	}
	const x = await result.json();

	return [x, true];
}

export async function pause() {
	const accessToken = localStorage.getItem('access_token') || '';

	const deviceId = await getActiveDeviceId(accessToken, 1);
	if (!deviceId) {
		return false;
	}

	await fetch('https://api.spotify.com/v1/me/player/pause', {
		method: 'PUT',
		headers: { Authorization: `Bearer ${accessToken}` },
		body: JSON.stringify({ device_id: deviceId }),
	});
}

export async function play() {
	const accessToken = localStorage.getItem('access_token') || '';

	const deviceId = await getActiveDeviceId(accessToken, 1);
	if (!deviceId) {
		return false;
	}

	await fetch('https://api.spotify.com/v1/me/player/play', {
		method: 'PUT',
		headers: { Authorization: `Bearer ${accessToken}` },
		body: JSON.stringify({ device_id: deviceId }),
	});
	return true;
}

export async function next() {
	const accessToken = localStorage.getItem('access_token') || '';

	const deviceId = await getActiveDeviceId(accessToken, 2);
	if (!deviceId) {
		return false;
	}

	await fetch('https://api.spotify.com/v1/me/player/next', {
		method: 'POST',
		headers: { Authorization: `Bearer ${accessToken}` },
		body: JSON.stringify({ device_id: deviceId }),
	});
}

export async function previous(
	currentlyPlaying: boolean,
	playingProgress: number,
) {
	const accessToken = localStorage.getItem('access_token') || '';

	const deviceId = await getActiveDeviceId(accessToken, 2);
	if (!deviceId) {
		return false;
	}

	if (currentlyPlaying && playingProgress > 5000) {
		return seek(0);
	}
	await fetch('https://api.spotify.com/v1/me/player/previous', {
		method: 'POST',
		headers: { Authorization: `Bearer ${accessToken}` },
		body: JSON.stringify({
			device_id: deviceId,
		}),
	});
}

export async function seek(position: number) {
	const accessToken = localStorage.getItem('access_token') || '';

	const deviceId = await getActiveDeviceId(accessToken, 3);
	if (!deviceId) {
		return false;
	}

	await fetch(
		`https://api.spotify.com/v1/me/player/seek?position_ms=${position}`,
		{
			method: 'PUT',
			headers: { Authorization: `Bearer ${accessToken}` },
			body: JSON.stringify({ device_id: deviceId }),
		},
	);
}

export async function heart(isHearted: boolean, trackId: string) {
	const accessToken = localStorage.getItem('access_token') || '';
	if (isHearted) {
		await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
			method: 'DELETE',
			headers: { Authorization: `Bearer ${accessToken}` },
		});
	} else {
		await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackId}`, {
			method: 'PUT',
			headers: { Authorization: `Bearer ${accessToken}` },
		});
	}
}

export async function isHearted(trackId: string) {
	const accessToken = localStorage.getItem('access_token') || '';
	const result = await fetch(
		`https://api.spotify.com/v1/me/tracks/contains?ids=${trackId}`,
		{
			method: 'GET',
			headers: { Authorization: `Bearer ${accessToken}` },
		},
	);

	const res = await result.json();
	return res[0];
}
