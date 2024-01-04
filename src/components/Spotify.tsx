// TODO: Implement heart
// TODO: Add replay from pervious device when no song is active
// TODO: Fix key breaking after a while
// TODO: Simplify Code

import { useEffect, useState } from 'react';
import {
	redirectToAuthCodeFlow,
	refreshToken,
	pause,
	player,
	play,
	next,
	seek,
	getActiveDeviceId,
	heart,
} from '../utils/SpotifyPKCE';
import {
	IoIosHeartEmpty,
	IoIosPause,
	IoIosPlay,
	IoIosSkipBackward,
	IoIosSkipForward,
} from 'react-icons/io';

export default function Spotify() {
	const [seekPosition, setSeekPosition] = useState<number>(0);
	const [currentlyPlaying, setCurrentlyPlaying] = useState<TrackObject | null>(
		null,
	);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [playingProgress, setPlayingProgress] = useState<number>(0);
	const [pausedActive, setPausedActive] = useState<boolean>(false);
	const [sinceAPICall, setSinceAPICall] = useState<number>(0);
	const [apiCallInProgress, setApiCallInProgress] = useState<boolean>(false);
	const [afterAction, setAfterAction] = useState<number>(0);

	const clientId = process.env.SPOTIFY_CLIENT_ID || '';
	const URL = process.env.CALLBACK_URL || 'http://localhost:5173';
	const params = new URLSearchParams(window.location.search);
	const code = params.get('code');

	async function previous() {
		const accessToken = localStorage.getItem('access_token') || '';
		if (currentlyPlaying && playingProgress > 5000) {
			return seek(0);
		}
		await fetch('https://api.spotify.com/v1/me/player/previous', {
			method: 'POST',
			headers: { Authorization: `Bearer ${accessToken}` },
			body: JSON.stringify({
				device_id: await getActiveDeviceId(accessToken),
			}),
		});
	}

	async function getAccessToken(clientId: string, code: string, URL: string) {
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

	useEffect(() => {
		const interval = setInterval(async () => {
			if (
				(sinceAPICall < 10 ||
					(isPlaying &&
						currentlyPlaying?.duration_ms !== undefined &&
						Math.abs(playingProgress - currentlyPlaying.duration_ms) < 2000) ||
					(afterAction != 0 && sinceAPICall < 2500)) &&
				!apiCallInProgress
			) {
				setApiCallInProgress(true);

				const storedAccessToken = localStorage.getItem('access_token');

				if (storedAccessToken) {
					if (
						Date.now() > ((localStorage.getItem('expires_in') || 0) as number)
					) {
						await refreshToken(clientId, URL);
					}

					const play = await player(storedAccessToken);
					setIsPlaying(play[1]);

					if (play[1]) {
						if (Math.abs(play[0].progress_ms - playingProgress) > 1000) {
							setPlayingProgress(play[0].progress_ms);
						}
						setPausedActive(play[0].is_playing);
					} else {
						setPausedActive(false);
					}

					setCurrentlyPlaying(play[1] ? play[0].item : play[0]);
				} else if (!code) {
					redirectToAuthCodeFlow(clientId, URL);
				} else {
					const accessToken = await getAccessToken(clientId, code, URL);
					localStorage.setItem('access_token', accessToken);
					const currentlyPlaying = await player(accessToken);
					setCurrentlyPlaying(currentlyPlaying[0]);
					setIsPlaying(currentlyPlaying[1]);

					Date.now() > ((localStorage.getItem('expires_in') || 0) as number);
					await refreshToken(clientId, URL);
				}
				setSinceAPICall(3000);
				setApiCallInProgress(false);
				setAfterAction(afterAction == 1 ? 2 : 0);
			}
			if (!isPlaying || pausedActive)
				setPlayingProgress((prevProgress) => prevProgress + 1.55);
			setSinceAPICall((prevSinceAPICall) => prevSinceAPICall - 1);
		}, 1);

		return () => {
			clearInterval(interval);
		};
	}, [
		URL,
		clientId,
		code,
		sinceAPICall,
		apiCallInProgress,
		isPlaying,
		playingProgress,
		currentlyPlaying,
		afterAction,
		pausedActive,
	]);

	return (
		<>
			{currentlyPlaying != null ? (
				<div className="fixed bottom-0 flex h-max w-full justify-center">
					<div className="border-ctp-surface0 bg-ctp-crust text-ctp-text flex max-w-full overflow-hidden rounded-t-lg border-x-2 border-t-2 shadow-md sm:w-2/3 sm:max-w-xl">
						<div className="w-1/3 flex-shrink-0">
							<img
								className="h-auto w-auto object-cover"
								src={currentlyPlaying.album.images[0].url}
								alt={currentlyPlaying.album.name}
								style={{
									aspectRatio: '100/100',
									objectFit: 'cover',
								}}
								width="100"
							/>
						</div>
						<div className="flex h-full w-2/3 items-center justify-center gap-y-4">
							<div className="flex h-full w-full flex-col justify-between space-y-4 px-6 py-6">
								<div className="mb-3 flex items-center justify-between">
									<div className="w-[85%]">
										<p className="text-md text-ctp-text overflow-hidden text-ellipsis whitespace-nowrap font-medium">
											{currentlyPlaying.name}
										</p>
										<p className="text-md text-ctp-subtext1">
											{currentlyPlaying.artists[0].name}
										</p>
									</div>
									<button className="rounded-full">
										<IoIosHeartEmpty
											className="h-6 w-6"
											onClick={() => heart()}
										/>
									</button>
								</div>
								{isPlaying && (
									<div className="flex items-center pb-4">
										<div className="border-ctp-crust bg-ctp-surface2 relative h-3 w-full rounded-lg border">
											<div
												className="bg-ctp-green h-full rounded-lg"
												style={{
													width:
														((playingProgress % currentlyPlaying.duration_ms) /
															currentlyPlaying.duration_ms) *
															100 +
														'%',
												}}
											/>
											<input
												className="absolute top-0 h-full w-full cursor-pointer opacity-0"
												type="range"
												min="0"
												max={currentlyPlaying.duration_ms}
												value={playingProgress % currentlyPlaying.duration_ms}
												onChange={(e) => {
													setSeekPosition(Number(e.target.value));
												}}
												onMouseUp={() => {
													seek(seekPosition);
													setAfterAction(1);
												}}
											/>
											<div
												className="bg-ctp-green absolute top-[50%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full"
												style={{
													left:
														((playingProgress % currentlyPlaying.duration_ms) /
															currentlyPlaying.duration_ms) *
															100 +
														'%',
												}}
											/>
											<div className="mt-1">
												<p className="text-ctp-subtext1 font-mono text-xs font-light">
													{Math.floor(
														(playingProgress % currentlyPlaying.duration_ms) /
															1000 /
															60,
													)}
													:
													{(
														'0' +
														Math.floor(
															((playingProgress %
																currentlyPlaying.duration_ms) /
																1000) %
																60,
														)
													).slice(-2)}{' '}
													/{' '}
													{Math.floor(currentlyPlaying.duration_ms / 1000 / 60)}
													:
													{(
														'0' +
														Math.floor(
															(currentlyPlaying.duration_ms / 1000) % 60,
														)
													).slice(-2)}
												</p>
											</div>
										</div>
									</div>
								)}
								<div className="flex justify-center space-x-4">
									<button
										className="rounded-full"
										onClick={() => {
											previous();
											setAfterAction(1);
										}}>
										<IoIosSkipBackward className="h-6 w-6" />
									</button>
									<button
										className="rounded-full"
										onClick={() => {
											pausedActive ? pause() : play();
											setAfterAction(1);
										}}>
										{pausedActive ? (
											<IoIosPause className="h-6 w-6" />
										) : (
											<IoIosPlay className="h-6 w-6" />
										)}
									</button>
									<button
										className="rounded-full"
										onClick={() => {
											next();
											setAfterAction(1);
										}}>
										<IoIosSkipForward className="h-6 w-6" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<></>
			)}
		</>
	);
}
