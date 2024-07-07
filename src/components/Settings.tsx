/* eslint-disable react-hooks/exhaustive-deps */
// TODO: Make functions simpler

import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuTrigger,
} from '@/shadcn/components/ui/context-menu';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/shadcn/components/ui/popover';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shadcn/components/ui/tooltip';

import { Input } from '@/shadcn/components/ui/input';
import {
	ToggleGroup,
	ToggleGroupItem,
} from '@/shadcn/components/ui/toggle-group';

import { Button } from '@/shadcn/components/ui/button';
import { clearKeys } from '@/utils/SpotifyPKCE';
import { handleUpdate, updateData } from '@/utils/sync';
import { FiCalendar, FiSettings } from 'react-icons/fi';
import { MdSync } from 'react-icons/md';
import { SiSpotify } from 'react-icons/si';
import {
	TbCheck,
	TbClipboard,
	TbTemperatureCelsius,
	TbTemperatureFahrenheit,
} from 'react-icons/tb';
import { TiWeatherCloudy } from 'react-icons/ti';
import { RedirContext } from '..';
import { CountdownCreatePopup, CountdownIO, CountdownItem } from './Countdown';
import { CreateSyncCode, LoadSyncCode } from './Sync';
import { IoIosMoon, IoIosSunny } from 'react-icons/io';

export default function Settings({
	setSpotify,
	setUnit,
	setCountdown,
	setWeather,
	setCountdowns,
	setDark,
	dark,
	countdowns,
}: {
	setSpotify: (s: boolean) => void;
	setUnit: (s: string) => void;
	setCountdown: (s: boolean) => void;
	setWeather: (s: boolean) => void;
	setCountdowns: (s: Countdown[]) => void;
	setDark: (s: boolean) => void;
	dark: boolean;
	countdowns: Countdown[];
}) {
	const [toggleVal, setToggleVal] = useState<string[]>([]);
	const [countOpen, setCountOpen] = useState<boolean>(false);
	const [copy, setCopy] = useState<boolean>(false);

	const setRedirNeeded = useContext(RedirContext).setRedirNeeded;

	// WTF IS GOING ON HERE?

	function checkValues() {
		let values: string[] = [];
		let change: boolean = false;

		[values, change] = handleCheck('spotify', values);
		setSpotify(change);

		[values, change] = handleCheck('countdown', values);
		setCountdown(change);

		[values, change] = handleCheck('weather', values);
		setWeather(change);

		setToggleVal(values);
		return values;
	}

	function handleCheck(type: string, values: string[]): [string[], boolean] {
		const local = localStorage.getItem(`is_${type}`) || '';
		let check = local === 'true';

		if (!local) {
			localStorage.setItem(`is_${type}`, 'true');
			check = true;
		}

		if (check) {
			values.push(type);
		}

		return [values, check];
	}

	async function toggleValues(s: string[]) {
		localStorage.setItem('is_spotify', s.includes('spotify').toString());
		localStorage.setItem('is_countdown', s.includes('countdown').toString());
		localStorage.setItem('is_weather', s.includes('weather').toString());

		setSpotify(s.includes('spotify'));
		setCountdown(s.includes('countdown'));
		setWeather(s.includes('weather'));

		await handleUpdate(localStorage.code || '');
		updatePage();
	}

	useEffect(() => {
		async function get() {
			await updateData(localStorage.code || '');
			updatePage();
		}

		get();
		checkValues();
		updatePage();
	}, []);

	function resetSpotifyData(): void {
		clearKeys();
		setRedirNeeded(true);
		toast.success(`Successfully cleared spotify authentication data.`);
	}

	function updatePage() {
		setSpotify(localStorage.is_spotify === 'true');
		setCountdown(localStorage.is_countdown === 'true');
		setWeather(localStorage.is_weather === 'true');

		setUnit(localStorage.unit || 'f');
		setCountdowns(JSON.parse(localStorage.countdowns || '[]'));
		setDark(localStorage.theme === 'dark');
	}

	return (
		<TooltipProvider>
			<Popover>
				<PopoverTrigger
					className="m-3 mr-2 sm:m-4 sm:w-full"
					onClick={() => checkValues()}>
					<div className="flex h-14 w-14 items-center justify-center rounded-lg bg-neutral-50 p-4 ring-2 ring-neutral-600 transition-all duration-200 ease-in-out hover:bg-neutral-200 dark:bg-neutral-950 dark:ring-neutral-800 hover:dark:bg-neutral-900">
						<FiSettings
							className="h-10 w-10 text-stone-800 hover:text-stone-950 dark:text-stone-300 dark:hover:text-stone-200"
							size={'4em'}
						/>
					</div>
				</PopoverTrigger>
				<PopoverContent
					onOpenAutoFocus={(e) => e.preventDefault()}
					className="mb-1 ml-2 flex h-full w-full flex-col gap-y-4 rounded-lg border-2 border-neutral-800 bg-neutral-50 p-4 dark:bg-neutral-950">
					<ToggleGroup
						type="multiple"
						className="space-x-2"
						defaultValue={toggleVal}
						onValueChange={async (value) => toggleValues(value)}>
						<ContextMenu>
							<ContextMenuTrigger>
								<ToggleGroupItem
									value="spotify"
									className="flex aspect-square size-auto rounded-lg border-2 border-neutral-500 p-3 text-green-500/60 hover:bg-neutral-100/80 hover:text-green-500/90 data-[state=on]:bg-neutral-100 data-[state=on]:text-green-500 hover:data-[state=on]:bg-neutral-100/70 hover:data-[state=on]:text-green-500/80 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-900/80 dark:hover:text-green-500/90 dark:data-[state=on]:bg-neutral-900 dark:data-[state=on]:text-green-500 dark:hover:data-[state=on]:bg-neutral-900/80 dark:data-[state=on]:hover:text-green-500/70">
									<Tooltip>
										<TooltipTrigger>
											<SiSpotify className="size-7" />
										</TooltipTrigger>
										<TooltipContent className="m-1 border-2 border-neutral-700 bg-neutral-50 p-2 dark:bg-neutral-950">
											<p className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-300">
												Right click to edit Spotify settings.
											</p>
										</TooltipContent>
									</Tooltip>
								</ToggleGroupItem>
							</ContextMenuTrigger>
							<ContextMenuContent className="m-2 flex w-full flex-col gap-y-4 rounded-lg border-[2px] border-neutral-700 bg-neutral-50 p-4 dark:bg-neutral-950">
								<div className="flex flex-row items-center gap-x-3">
									<SiSpotify className="size-10 text-green-500" />
									<Input
										// placeholder="Spotify Client ID"
										disabled
										placeholder="Not Yet Implemented"
										type="password"
										className="w-full rounded-lg border-2 border-neutral-700 bg-neutral-50 px-3 text-lg text-neutral-600 outline-none ring-neutral-700 placeholder:font-medium placeholder:text-stone-600 focus:outline-stone-800 active:outline-stone-800 dark:border-neutral-500 dark:bg-neutral-950 dark:text-neutral-400 dark:placeholder-stone-200"
									/>
								</div>
								<button
									onClick={() => resetSpotifyData()}
									className="mx-auto flex w-auto flex-col rounded-lg border-2 border-neutral-700 p-3 text-center text-sm font-semibold text-neutral-800 dark:text-neutral-300">
									<p className="mx-auto w-full text-center">
										Reset Spotify Auth Data
									</p>
									<span className="mx-auto text-center text-xs font-medium text-neutral-600 dark:text-neutral-400">
										(Use if the spotify widget isn't loading.)
									</span>
								</button>
							</ContextMenuContent>
						</ContextMenu>

						<ContextMenu>
							<ContextMenuTrigger>
								<ToggleGroupItem
									value="countdown"
									className="flex aspect-square size-auto rounded-lg border-2 border-neutral-500 p-3 text-slate-500/60 hover:bg-neutral-100/80 hover:text-slate-500/90 data-[state=on]:bg-neutral-100 data-[state=on]:text-slate-500 hover:data-[state=on]:bg-neutral-100/70 hover:data-[state=on]:text-slate-500/80 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-900/80 dark:hover:text-slate-500/90 dark:data-[state=on]:bg-neutral-900 dark:data-[state=on]:text-slate-500 dark:hover:data-[state=on]:bg-neutral-900/80 dark:data-[state=on]:hover:text-slate-500/70">
									<Tooltip>
										<TooltipTrigger>
											<FiCalendar className="size-7" />
										</TooltipTrigger>
										<TooltipContent className="m-1 border-2 border-neutral-700 bg-neutral-50 p-2 dark:bg-neutral-950">
											<p className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-300">
												Right click to edit countdown settings.
											</p>
										</TooltipContent>
									</Tooltip>
								</ToggleGroupItem>
							</ContextMenuTrigger>
							<ContextMenuContent className="m-2 flex w-full min-w-[15dvw] flex-col gap-y-4 rounded-lg border-[2px] border-neutral-700 bg-neutral-50 p-4 pt-3 dark:bg-neutral-950">
								<h1 className="text-xl font-semibold">Countdowns:</h1>
								{countdowns.map((countdown, index) => {
									return (
										<CountdownItem
											key={index}
											name={countdown.name}
											timestamp={countdown.timestamp}
											countdowns={countdowns}
											globalOpen={countOpen}
											setCountdowns={setCountdowns}
											setGlobalOpen={setCountOpen}
										/>
									);
								})}
								{countdowns.length < 3 && (
									<div className="flex h-full w-full justify-start gap-1 pr-3">
										<CountdownIO
											setCountdowns={setCountdowns}
											countdowns={countdowns}
											setGlobalOpen={setCountOpen}
										/>
										<CountdownCreatePopup
											setCountdowns={setCountdowns}
											countdowns={countdowns}
											setGlobalOpen={setCountOpen}
										/>
									</div>
								)}
							</ContextMenuContent>
						</ContextMenu>

						<ContextMenu>
							<ContextMenuTrigger>
								<ToggleGroupItem
									value="weather"
									className="flex aspect-square size-auto rounded-lg border-2 border-neutral-500 p-3 text-amber-600/60 hover:bg-neutral-100/80 hover:text-amber-600/90 data-[state=on]:bg-neutral-100 data-[state=on]:text-amber-600 hover:data-[state=on]:bg-neutral-100/70 hover:data-[state=on]:text-amber-600/80 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-900/80 dark:hover:text-amber-600/90 dark:data-[state=on]:bg-neutral-900 dark:data-[state=on]:text-amber-600 dark:hover:data-[state=on]:bg-neutral-900/80 dark:data-[state=on]:hover:text-amber-600/70">
									<Tooltip>
										<TooltipTrigger>
											<TiWeatherCloudy className="size-7" />
										</TooltipTrigger>
										<TooltipContent className="m-1 border-2 border-neutral-700 bg-neutral-50 p-2 dark:bg-neutral-950">
											<p className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-300">
												Right click to edit weather settings.
											</p>
										</TooltipContent>
									</Tooltip>
								</ToggleGroupItem>
							</ContextMenuTrigger>
							<ContextMenuContent className="m-2 flex w-full flex-col gap-y-4 rounded-lg border-[3px] border-neutral-700 bg-neutral-50 p-4 dark:bg-neutral-950">
								<ToggleGroup
									type="single"
									className="space-x-[0.375rem]"
									defaultValue={localStorage.unit || 'f'}
									onValueChange={async (v) => {
										if (v) {
											localStorage.setItem('unit', v);
											setUnit(v);
										}
										await handleUpdate(localStorage.code || '');
										updatePage();
									}}>
									<ToggleGroupItem
										className="flex aspect-square h-auto w-auto items-center justify-center rounded-lg border-2 border-neutral-500 p-3 text-zinc-800/90 hover:text-zinc-800/90 dark:border-neutral-700 dark:text-zinc-400/70 dark:hover:bg-neutral-900 dark:hover:text-zinc-300/90 dark:data-[state=on]:bg-neutral-900 dark:data-[state=on]:text-zinc-300 dark:data-[state=on]:hover:bg-neutral-900 dark:data-[state=on]:hover:text-zinc-400"
										value="f"
										disabled={localStorage.unit == 'f'}>
										<TbTemperatureFahrenheit className="size-5" />
									</ToggleGroupItem>
									<ToggleGroupItem
										className="flex aspect-square h-auto w-auto items-center justify-center rounded-lg border-2 border-neutral-500 p-3 text-zinc-800/90 hover:text-zinc-800/90 dark:border-neutral-700 dark:text-zinc-400/70 dark:hover:bg-neutral-900 dark:hover:text-zinc-300/90 dark:data-[state=on]:bg-neutral-900 dark:data-[state=on]:text-zinc-300 dark:data-[state=on]:hover:bg-neutral-900 dark:data-[state=on]:hover:text-zinc-400"
										value="c"
										disabled={localStorage.unit == 'c'}>
										<TbTemperatureCelsius className="size-5" />
									</ToggleGroupItem>
								</ToggleGroup>
								{/* <div className="flex flex-row items-center gap-x-3">
									<TiWeatherCloudy className="size-10 text-amber-600" />
									<Input
										// placeholder="OpenWeatherMap API Key"
										disabled
										placeholder="Not Yet Implemented"
										type="password"
										className="w-full rounded-lg border-2 border-neutral-700 bg-neutral-50 px-3 text-lg text-neutral-600 placeholder-stone-600 outline-none ring-neutral-700 placeholder:font-medium focus:outline-stone-800 active:outline-stone-800 dark:border-neutral-500 dark:bg-neutral-950 dark:text-neutral-400 dark:placeholder-stone-200"
									/>
								</div> */}
							</ContextMenuContent>
						</ContextMenu>

						{/* <ToggleGroupItem
						value="minigames"
						className="flex aspect-square h-auto w-auto items-center justify-center rounded-lg border-2 border-neutral-700 p-3 text-red-800/70 hover:bg-neutral-200 hover:text-red-400 data-[state=on]:bg-neutral-900 data-[state=on]:text-red-600 data-[state=on]:hover:bg-neutral-200 dark:bg-neutral-800 data-[state=on]:hover:text-red-500">
						<FaGamepad className="size-7" />
						</ToggleGroupItem> */}
					</ToggleGroup>
					<div className="flex w-full flex-row">
						<Button
							className="ml-auto flex aspect-square size-max rounded-lg border-2 border-neutral-500 bg-neutral-100 p-2 text-stone-700 hover:bg-neutral-100/80 hover:text-stone-700/90 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-stone-300 dark:hover:bg-neutral-900/90 dark:hover:text-stone-300/90"
							onClick={async () => {
								setDark(!dark);
								await new Promise((r) => setTimeout(r, 1));
								await handleUpdate(localStorage.code || '');
								updatePage();
							}}>
							{dark ? (
								<IoIosSunny className="size-5" />
							) : (
								<IoIosMoon className="size-5" />
							)}
						</Button>
						<Popover>
							<PopoverTrigger className="ml-1 flex justify-end pr-1">
								<div className="flex aspect-square size-max rounded-lg border-2 border-neutral-500 bg-neutral-100 p-2 text-stone-700 hover:bg-neutral-100/80 hover:text-stone-700/90 dark:border-neutral-700 dark:bg-neutral-900/70 dark:text-stone-300 dark:hover:bg-neutral-900/90 dark:hover:text-stone-300/90">
									<MdSync className="size-5" />
								</div>
							</PopoverTrigger>
							<PopoverContent className="m-2 flex w-full min-w-[15dvw] flex-col gap-y-4 rounded-lg border-[2px] border-neutral-700 bg-neutral-50 p-4 pt-3 dark:bg-neutral-950 dark:text-neutral-100">
								<h1 className="text-lg font-semibold">Sync:</h1>
								<div className="mx-auto flex flex-row gap-2 text-sm">
									{localStorage.code ? (
										<div className="flex flex-col gap-2">
											<div className="flex flex-row gap-2">
												<Button
													onClick={async () => {
														await handleUpdate(localStorage.code || '');
														updatePage();
													}}>
													Push Update To Database
												</Button>
												<Button
													variant={'outline'}
													onClick={async () => {
														await updateData(localStorage.code || '');
														updatePage();
													}}>
													Pull from Database
												</Button>
											</div>
											<div className="flex flex-row gap-2">
												<Input readOnly value={localStorage.code || ''} />
												<TooltipProvider>
													<Tooltip>
														<TooltipTrigger
															className="flex aspect-square size-auto items-center justify-center rounded-lg border-[1.5px] border-neutral-500 p-2 dark:border-neutral-800"
															onClick={async () => {
																navigator.clipboard.writeText(
																	localStorage.code || '',
																);
																setCopy(true);
																await new Promise((r) => setTimeout(r, 2000));
																setCopy(false);
															}}>
															{copy ? (
																<TbCheck className="size-[125%]" />
															) : (
																<TbClipboard className="size-[125%]" />
															)}
														</TooltipTrigger>
														<TooltipContent>
															<p>Click to Copy</p>
														</TooltipContent>
													</Tooltip>
												</TooltipProvider>
											</div>
										</div>
									) : (
										<>
											<CreateSyncCode />
											<LoadSyncCode updatePage={updatePage} />
										</>
									)}
								</div>
							</PopoverContent>
						</Popover>
					</div>
				</PopoverContent>
			</Popover>
		</TooltipProvider>
	);
}
