/* eslint-disable react-hooks/exhaustive-deps */
// TODO: Fix token being invalidated
// TODO: Add to queue button, maybe a queue list, shuffle, repeat, volume controls.
// TODO: Prevent loop by showing a toast as an error
// TODO: Store previous device id to try and play from it.
// TODO: Toast errors for failing to seek, heart, etc.
// TODO: Complete force click for actions.
// TODO: Refactor API code.
import { useEffect, useState } from 'react';
import {
	redirectToAuthCodeFlow,
	refreshToken,
	pause,
	player,
	play,
	next,
	seek,
	heart,
	isHearted,
	getAccessToken,
	previous,
	is_premium,
} from '../utils/SpotifyPKCE';
import {
	IoIosHeart,
	IoIosHeartEmpty,
	IoIosPause,
	IoIosPlay,
	IoIosSkipBackward,
	IoIosSkipForward,
} from 'react-icons/io';
import Heart from './Spotify/Heart';

export default function Spotify() {
	// let clientId = localStorage.getItem('spotify_client_id') || 'undefined';
	const clientId = process.env.SPOTIFY_CLIENT_ID || '';
	if (clientId === '') {
		throw new Error('Missing Spotify Client ID');
	}

	const URL = process.env.CALLBACK_URL || 'http://localhost:5173';
	const code = new URLSearchParams(window.location.search).get('code');
	const cooldown = 2500;

	const [seekPosition, setSeekPosition] = useState<number>(0);
	const [currentlyPlaying, setCurrentlyPlaying] = useState<TrackObject | null>(
		null,
	);
	const [isPremium, setIsPremium] = useState<boolean>(false);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const [playingProgress, setPlayingProgress] = useState<number>(0);
	const [sinceAPICall, setSinceAPICall] = useState<number>(0);
	const [apiCallInProgress, setApiCallInProgress] = useState<boolean>(false);
	const [hearted, setHearted] = useState<boolean>(false);
	const [heartClicked, setHeartClicked] = useState<boolean>(false);
	const [lastFocus, setLastFocus] = useState<boolean>(false);
	const [specialCheck, setSpecialCheck] = useState<number>(0);
	const [forceCall, setForceCall] = useState<boolean>(false);

	// const [forcedCallInProgress, setForcedCallInProgress] =
	// 	useState<boolean>(false);

	async function doStuff() {
		setForceCall(false);
		setApiCallInProgress(true);

		const storedAccessToken =
			localStorage.getItem('spotify_access_token') || 'undefined';

		if (code && storedAccessToken == 'undefined') {
			await getAccessToken(clientId, code, URL);
			const currentlyPlaying = await player(storedAccessToken);
			setCurrentlyPlaying(currentlyPlaying[0]);
			setIsPlaying(currentlyPlaying[1]);
		} else {
			if (storedAccessToken == 'undefined') {
				redirectToAuthCodeFlow(clientId, URL);
			} else {
				if (
					Date.now() >
					((localStorage.getItem('spotify_expires_in') || 0) as number)
				) {
					await refreshToken(clientId, URL);
					setSinceAPICall(cooldown / 10);
				} else {
					const play = await player(storedAccessToken);
					setIsPlaying(play[1]);

					if (play[1]) {
						setPlayingProgress(play[0].progress_ms);
						setIsPlaying(play[0].is_playing);
					}

					if (specialCheck == 0) {
						const hearted = await isHearted(
							play[1] ? play[0].item.id : play[0].id || '',
						);
						setHearted(hearted);

						setIsPremium(await is_premium());
					}
					setSpecialCheck((specialCheck + 1) % 3);

					setCurrentlyPlaying(play[1] ? play[0].item : play[0]);
				}
			}

			setSinceAPICall(cooldown);
			setApiCallInProgress(false);
			// setForcedCallInProgress(false);
		}
	}

	async function doAuth() {
		if (!apiCallInProgress) {
			setApiCallInProgress(true);
			const storedAccessToken =
				localStorage.getItem('spotify_access_token') || 'undefined';

			if (code && storedAccessToken == 'undefined') {
				await getAccessToken(clientId, code, URL);
				const currentlyPlaying = await player(storedAccessToken);
				setCurrentlyPlaying(currentlyPlaying[0]);
				setIsPlaying(currentlyPlaying[1]);
			} else {
				if (storedAccessToken == 'undefined') {
					redirectToAuthCodeFlow(clientId, URL);
				} else {
					if (
						Date.now() >
						((localStorage.getItem('spotify_expires_in') || 0) as number)
					) {
						await refreshToken(clientId, URL);
						setSinceAPICall(cooldown / 10);
					}
					setApiCallInProgress(false);
				}
			}
		}
	}

	function doInterval() {
		if (document.hasFocus() != lastFocus && document.hasFocus()) {
			setSinceAPICall(0);
			setApiCallInProgress(false);
		}

		setLastFocus(document.hasFocus());
		if (isPlaying) {
			setPlayingProgress(Math.round(100 * (playingProgress + 4.95 / 3)) / 100);
		}
		if (
			(isPlaying &&
				!apiCallInProgress &&
				currentlyPlaying?.duration_ms !== undefined &&
				playingProgress >= currentlyPlaying.duration_ms) ||
			(sinceAPICall < 10 && !apiCallInProgress) ||
			forceCall
		) {
			doStuff();
		}
		setSinceAPICall(sinceAPICall - 1);
	}

	useEffect(() => {
		const interval = setInterval(async () => {
			const storedAccessToken =
				localStorage.getItem('spotify_access_token') || 'undefined';

			if (storedAccessToken != 'undefined') {
				doInterval();
			} else {
				doAuth();
			}
		}, 1);

		return () => {
			clearInterval(interval);
		};
	}, [doInterval, doAuth]);

	function onAction() {
		// getInfo();
	}

	return (
		<>
			{currentlyPlaying != null ? (
				<div className="flex w-full max-w-full overflow-hidden rounded-t-lg border-x-2 border-t-2 border-neutral-800 bg-neutral-950 text-neutral-200 shadow-md sm:w-2/3 sm:max-w-xl">
					<div className="w-2/5 flex-shrink-0 sm:w-1/3">
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
					<div className="flex h-full w-3/5 items-center justify-center gap-y-4 sm:mx-auto sm:w-2/3">
						<div className="flex h-full w-full flex-col justify-between gap-y-2 px-5 py-4 sm:gap-y-4 sm:py-6">
							<div className="flex w-[95%] items-center justify-between sm:mb-3 sm:w-full">
								<div className="w-[75%] sm:w-[85%]">
									<p className="text-md -mb-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-neutral-200 sm:mb-0">
										{currentlyPlaying.name}
									</p>
									<p className="text-md overflow-hidden text-ellipsis whitespace-nowrap text-neutral-300">
										{currentlyPlaying.artists[0].name}
									</p>
								</div>
								<button
									className="rounded-full"
									onClick={() => {
										heart(hearted, currentlyPlaying?.id);
										setHeartClicked(true);
										// setAfterAction(1);
										setHearted(!hearted);
									}}>
									{hearted ? (
										heartClicked ? (
											<div className="h-6 w-6">
												<Heart />
											</div>
										) : (
											<IoIosHeart className="h-6 w-6 text-green-500" />
										)
									) : (
										<IoIosHeartEmpty
											className={(heartClicked && 'animate-shake') + ' h-6 w-6'}
										/>
									)}
								</button>
							</div>
							{isPlaying && (
								<div className="flex items-center pb-3 sm:pb-4">
									<div className="relative h-3 w-full rounded-lg border border-neutral-900 bg-neutral-800/90">
										<div
											className="h-full rounded-lg bg-green-400"
											style={{
												width:
													((playingProgress % currentlyPlaying.duration_ms) /
														currentlyPlaying.duration_ms) *
														100 +
													'%',
											}}
										/>
										{isPremium ? (
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
													const a = seek(seekPosition);
													a;
													onAction();
												}}
											/>
										) : (
											''
										)}
										<div
											className="absolute top-[50%] h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-green-400"
											style={{
												left:
													((playingProgress % currentlyPlaying.duration_ms) /
														currentlyPlaying.duration_ms) *
														100 +
													'%',
											}}
										/>
										<div className="mt-1">
											<p className="font-mono text-xs font-light text-neutral-300">
												{Math.floor(
													(playingProgress % currentlyPlaying.duration_ms) /
														1000 /
														60,
												)}
												:
												{(
													'0' +
													Math.floor(
														((playingProgress % currentlyPlaying.duration_ms) /
															1000) %
															60,
													)
												).slice(-2)}{' '}
												/ {Math.floor(currentlyPlaying.duration_ms / 1000 / 60)}
												:
												{(
													'0' +
													Math.floor((currentlyPlaying.duration_ms / 1000) % 60)
												).slice(-2)}
											</p>
										</div>
									</div>
								</div>
							)}
							{isPremium && (
								<div className="flex justify-center gap-x-4">
									<button
										className="rounded-full"
										onClick={() => {
											const a = previous(
												currentlyPlaying !== null,
												playingProgress,
											);
											a;
											setSinceAPICall(cooldown / 5);
											setApiCallInProgress(false);
										}}>
										<IoIosSkipBackward className="h-6 w-6" />
									</button>
									<button
										className="rounded-full"
										onClick={() => {
											if (isPremium) {
												const a = isPlaying ? pause() : play();
												a;
												setSinceAPICall(cooldown / 5);
												setApiCallInProgress(false);
											}
										}}>
										{isPlaying ? (
											<IoIosPause className="h-6 w-6" />
										) : (
											<IoIosPlay className="h-6 w-6" />
										)}
									</button>
									<button
										className="rounded-full"
										onClick={() => {
											if (isPremium) {
												const a = next();
												a;
												setSinceAPICall(cooldown / 5);
												setApiCallInProgress(false);
											}
										}}>
										<IoIosSkipForward className="h-6 w-6" />
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			) : (
				// Skeleton
				<div className="flex w-full max-w-full overflow-hidden rounded-t-lg border-x-2 border-t-2 border-neutral-800 bg-neutral-950 text-neutral-300 shadow-md sm:w-2/3 sm:max-w-xl">
					<div className="w-2/5 sm:w-1/3">
						<div className="aspect-square max-h-[calc(100%/30%)] w-full animate-pulse rounded-tl-md bg-neutral-800" />
					</div>
					<div className="flex h-full w-2/3 items-center justify-center gap-y-2 sm:gap-y-4">
						<div className="flex h-full w-full flex-col justify-between gap-y-2 px-5 py-5 sm:gap-y-4 sm:p-6 sm:px-5">
							<div className="mb-2 flex items-center justify-between sm:mb-2">
								<div className="w-full animate-pulse pt-[6px] sm:w-[80%]">
									<div className="mb-0.5 h-[14px] w-2/3 rounded-md bg-neutral-700 sm:mb-[10px]" />
									<div className="h-[14px] w-1/3 rounded-md bg-neutral-700" />
								</div>
								<div className="animate-pulse rounded-full">
									<div className="h-6 w-6 rounded-full bg-green-400/50" />
								</div>
							</div>
							<div className="flex flex-col gap-y-1 pb-4 sm:pb-2">
								<div className="relative h-3 w-full animate-pulse rounded-lg bg-neutral-700">
									<div className="h-full rounded-lg bg-neutral-600" />
								</div>
								<div className="h-3 w-1/4 rounded-md bg-neutral-700" />
							</div>
							<div className="flex justify-center gap-x-4">
								{[...Array(3)].map((_, index) => (
									<div key={index} className="animate-pulse rounded-full">
										<div className="h-6 w-6 rounded-full bg-neutral-600" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
