// TODO: Fix token being invalidated
// TODO: Store spotify data in an object for easier reset {access_token, expires_in, refresh_token, verifier}
// TODO: Add to queue button, maybe a queue list, shuffle, repeat, volume controls.
// TODO: Potential fix for the progress bar: detect if new song, if detected reset the increment to default
// TODO: Switch to cookies
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
	const clientId = process.env.SPOTIFY_CLIENT_ID || '';
	if (clientId === '') {
		throw new Error('Missing Spotify Client ID');
	}

	const URL = process.env.CALLBACK_URL || 'http://localhost:5173';
	const params = new URLSearchParams(window.location.search);
	const code = params.get('code');
	const cooldown = 1000;

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
	const [hearted, setHearted] = useState<boolean>(false);
	const [heartClicked, setHeartClicked] = useState<boolean>(false);
	const [lastFocus, setLastFocus] = useState<boolean>(false);
	const [lastUpdate, setLastUpdate] = useState<number>(0);
	const [heartedChecked, setHeartedChecked] = useState<boolean>(false);

	useEffect(() => {
		async function doStuff(cooldown: number) {
			if (
				(sinceAPICall < 10 ||
					(isPlaying &&
						currentlyPlaying?.duration_ms !== undefined &&
						Math.abs(playingProgress - currentlyPlaying.duration_ms) <
							cooldown - 500) ||
					(afterAction != 0 && sinceAPICall < 10)) &&
				!apiCallInProgress
			) {
				setApiCallInProgress(true);

				const storedAccessToken =
					localStorage.getItem('access_token') || 'undefined';

				if (code && storedAccessToken == 'undefined') {
					const accessToken = await getAccessToken(clientId, code, URL);
					localStorage.setItem('access_token', accessToken);
					const currentlyPlaying = await player(storedAccessToken);
					setCurrentlyPlaying(currentlyPlaying[0]);
					setIsPlaying(currentlyPlaying[1]);
					await refreshToken(clientId, URL);
					Date.now() > ((localStorage.getItem('expires_in') || 0) as number);
				} else {
					if (storedAccessToken == 'undefined') {
						redirectToAuthCodeFlow(clientId, URL);
					} else {
						if (
							Date.now() > ((localStorage.getItem('expires_in') || 0) as number)
						) {
							await refreshToken(clientId, URL);
							setSinceAPICall(cooldown - 500);
						} else {
							const play = await player(storedAccessToken);
							setIsPlaying(play[1]);

							if (play[1]) {
								setPlayingProgress(play[0].progress_ms); // Get diff between lastUpdate, and current progress, set current pos. Then set incrememnt to compensate.

								setLastUpdate(play[0].progress_ms);
								setPausedActive(play[0].is_playing);
							} else {
								setPausedActive(false);
							}
							if (!heartedChecked) {
								const hearted = await isHearted(
									play[1] ? play[0].item.id : play[0].id || '',
								);
								setHearted(hearted);
							}
							setHeartedChecked(!heartedChecked);

							setCurrentlyPlaying(play[1] ? play[0].item : play[0]);
						}
					}

					setSinceAPICall(cooldown);
					setApiCallInProgress(false);
					if (afterAction == 2) {
						setHeartClicked(false);
					}
					setAfterAction(afterAction == 2 ? 0 : afterAction + 1);
				}
				// if (!isPlaying || pausedActive)
				// 	setPlayingProgress((prevProgress) => prevProgress + increment);
				setSinceAPICall((prevSinceAPICall) => prevSinceAPICall - 1);
			}
		}

		const interval = setInterval(async () => {
			if (document.hasFocus() != lastFocus && document.hasFocus()) {
				setSinceAPICall(0);
				setAfterAction(1);
				setApiCallInProgress(false);
			}
			setLastFocus(document.hasFocus());
			setPlayingProgress(playingProgress + cooldown / 600);
			doStuff(cooldown);
			setSinceAPICall(sinceAPICall - 1);
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
		lastFocus,
		lastUpdate,
		heartedChecked,
	]);

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
										setAfterAction(1);
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
							<div className="flex justify-center gap-x-4">
								<button
									className="rounded-full"
									onClick={() => {
										previous(currentlyPlaying !== null, playingProgress);
										setAfterAction(1);
									}}>
									<IoIosSkipBackward className="h-6 w-6" />
								</button>
								<button
									className="rounded-full"
									onClick={() => {
										pausedActive ? pause() : play();
										setAfterAction(1);
										setApiCallInProgress(false);
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
