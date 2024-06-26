/* eslint-disable react-hooks/exhaustive-deps */
// TODO: Prevent tooltip from appearing when hovering over popover.
// TODO: Make functions simpler
// TODO: Fix broken weather switching

import { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';

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
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuTrigger,
} from '@/shadcn/components/ui/context-menu';

import {
	ToggleGroup,
	ToggleGroupItem,
} from '@/shadcn/components/ui/toggle-group';
import { Input } from '@/shadcn/components/ui/input';

import { clearKeys } from '@/utils/SpotifyPKCE';
import { FiCalendar, FiSettings } from 'react-icons/fi';
import { SiSpotify } from 'react-icons/si';
import { TbTemperatureCelsius, TbTemperatureFahrenheit } from 'react-icons/tb';
import { TiWeatherCloudy } from 'react-icons/ti';
import { RedirContext } from '..';
import { CountdownCreatePopup, CountdownItem } from './Countdown';

export default function Settings({
	setSpotify,
	setTemp,
	setCountdown,
	setWeather,
	setCountdowns,
	countdowns,
}: {
	setSpotify: (s: boolean) => void;
	setTemp: (s: string) => void;
	setCountdown: (s: boolean) => void;
	setWeather: (s: boolean) => void;
	setCountdowns: (s: Countdown[]) => void;
	countdowns: Countdown[];
}) {
	const [toggleVal, setToggleVal] = useState<string[]>([]);

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

	function toggleValues(s: string[]) {
		localStorage.setItem('is_spotify', s.includes('spotify').toString());
		localStorage.setItem('is_countdown', s.includes('countdown').toString());
		localStorage.setItem('is_weather', s.includes('weather').toString());

		setSpotify(s.includes('spotify'));
		setCountdown(s.includes('countdown'));
		setWeather(s.includes('weather'));
	}

	useEffect(() => {
		checkValues();
	}, []);

	function resetSpotifyData(): void {
		clearKeys();
		setRedirNeeded(true);
		toast.success(`Successfully cleared spotify authentication data.`, {
			style: {
				border: '1px solid #171717',
				padding: '12px',
				color: '#d4d4d4',
				backgroundColor: '#0a0a0a',
				textAlign: 'center',
			},
			iconTheme: {
				primary: '#16a34a',
				secondary: '#171717',
			},
		});
	}

	return (
		<TooltipProvider>
			<Popover>
				<PopoverTrigger
					className="m-4 mr-2 w-full"
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
						onValueChange={(value) => toggleValues(value)}>
						<Tooltip>
							<TooltipTrigger>
								<ContextMenu>
									<ContextMenuTrigger>
										<ToggleGroupItem
											value="spotify"
											className="flex aspect-square size-auto rounded-lg border-2 border-neutral-500 p-3 text-green-500/60 hover:bg-neutral-100/80 hover:text-green-500/90 data-[state=on]:bg-neutral-100 data-[state=on]:text-green-500 hover:data-[state=on]:bg-neutral-100/70 hover:data-[state=on]:text-green-500/80 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-900/80 dark:hover:text-green-500/90 dark:data-[state=on]:bg-neutral-900 dark:data-[state=on]:text-green-500 dark:hover:data-[state=on]:bg-neutral-900/80 dark:data-[state=on]:hover:text-green-500/70">
											<SiSpotify className="size-7" />
										</ToggleGroupItem>
									</ContextMenuTrigger>
									<ContextMenuContent className="m-2 flex w-full flex-col gap-y-4 rounded-lg border-[3px] border-neutral-700 bg-neutral-50 p-4 dark:bg-neutral-950">
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
							</TooltipTrigger>
							<TooltipContent className="m-1 border-2 border-neutral-700 bg-neutral-50 p-2 dark:bg-neutral-950">
								<p className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-300">
									Right click to edit Spotify settings.
								</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger>
								<ContextMenu>
									<ContextMenuTrigger>
										<ToggleGroupItem
											value="countdown"
											className="flex aspect-square size-auto rounded-lg border-2 border-neutral-500 p-3 text-slate-500/60 hover:bg-neutral-100/80 hover:text-slate-500/90 data-[state=on]:bg-neutral-100 data-[state=on]:text-slate-500 hover:data-[state=on]:bg-neutral-100/70 hover:data-[state=on]:text-slate-500/80 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-900/80 dark:hover:text-slate-500/90 dark:data-[state=on]:bg-neutral-900 dark:data-[state=on]:text-slate-500 dark:hover:data-[state=on]:bg-neutral-900/80 dark:data-[state=on]:hover:text-slate-500/70">
											<FiCalendar className="size-7" />
										</ToggleGroupItem>
									</ContextMenuTrigger>
									<ContextMenuContent className="m-2 flex w-full min-w-[15dvw] flex-col gap-y-4 rounded-lg border-[3px] border-neutral-700 bg-neutral-50 p-4 pt-3 dark:bg-neutral-950">
										<h1 className="text-xl font-semibold">Countdowns:</h1>
										{countdowns.map((countdown, index) => {
											return (
												<CountdownItem
													key={index}
													name={countdown.name}
													timestamp={countdown.timestamp}
													setCountdowns={setCountdowns}
													countdowns={countdowns}
												/>
											);
										})}
										{countdowns.length < 3 && (
											<div className="flex h-full w-full justify-start pr-3">
												<CountdownCreatePopup
													setCountdowns={setCountdowns}
													countdowns={countdowns}
												/>
											</div>
										)}
									</ContextMenuContent>
								</ContextMenu>
							</TooltipTrigger>
							<TooltipContent className="m-1 border-2 border-neutral-700 bg-neutral-50 p-2 dark:bg-neutral-950">
								<p className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-300">
									Right click to edit countdown settings.
								</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger>
								<ContextMenu>
									<ContextMenuTrigger>
										<ToggleGroupItem
											value="weather"
											className="flex aspect-square size-auto rounded-lg border-2 border-neutral-500 p-3 text-amber-600/60 hover:bg-neutral-100/80 hover:text-amber-600/90 data-[state=on]:bg-neutral-100 data-[state=on]:text-amber-600 hover:data-[state=on]:bg-neutral-100/70 hover:data-[state=on]:text-amber-600/80 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-900/80 dark:hover:text-amber-600/90 dark:data-[state=on]:bg-neutral-900 dark:data-[state=on]:text-amber-600 dark:hover:data-[state=on]:bg-neutral-900/80 dark:data-[state=on]:hover:text-amber-600/70">
											<TiWeatherCloudy className="size-7" />
										</ToggleGroupItem>
									</ContextMenuTrigger>
									<ContextMenuContent className="m-2 flex w-full flex-col gap-y-4 rounded-lg border-[3px] border-neutral-700 bg-neutral-50 p-4 dark:bg-neutral-950">
										<ToggleGroup
											type="single"
											className="space-x-[0.375rem]"
											defaultValue={localStorage.getItem('temp') || 'f'}
											onValueChange={(v) => {
												if (v) {
													localStorage.setItem('temp', v);
													setTemp(v);
												}
											}}>
											<ToggleGroupItem
												className="flex aspect-square h-auto w-auto items-center justify-center rounded-lg border-2 border-neutral-500 p-3 text-zinc-700/70 hover:text-zinc-800/90 dark:border-neutral-700 dark:text-zinc-400/70 dark:hover:bg-neutral-900 dark:hover:text-zinc-300/90 dark:data-[state=on]:bg-neutral-900 dark:data-[state=on]:text-zinc-300 dark:data-[state=on]:hover:bg-neutral-900 dark:data-[state=on]:hover:text-zinc-400"
												value="f"
												disabled={localStorage.getItem('temp') == 'f'}>
												<TbTemperatureFahrenheit className="size-5" />
											</ToggleGroupItem>
											<ToggleGroupItem
												className="flex aspect-square h-auto w-auto items-center justify-center rounded-lg border-2 border-neutral-500 p-3 text-zinc-700/70 hover:text-zinc-800/90 dark:border-neutral-700 dark:text-zinc-400/70 dark:hover:bg-neutral-900 dark:hover:text-zinc-300/90 dark:data-[state=on]:bg-neutral-900 dark:data-[state=on]:text-zinc-300 dark:data-[state=on]:hover:bg-neutral-900 dark:data-[state=on]:hover:text-zinc-400"
												value="c"
												disabled={localStorage.getItem('temp') == 'f'}>
												<TbTemperatureCelsius className="size-5" />
											</ToggleGroupItem>
										</ToggleGroup>
										<div className="flex flex-row items-center gap-x-3">
											<TiWeatherCloudy className="size-10 text-amber-600" />
											<Input
												// placeholder="OpenWeatherMap API Key"
												disabled
												placeholder="Not Yet Implemented"
												type="password"
												className="w-full rounded-lg border-2 border-neutral-700 bg-neutral-50 px-3 text-lg text-neutral-600 placeholder-stone-600 outline-none ring-neutral-700 placeholder:font-medium focus:outline-stone-800 active:outline-stone-800 dark:border-neutral-500 dark:bg-neutral-950 dark:text-neutral-400 dark:placeholder-stone-200"
											/>
										</div>
									</ContextMenuContent>
								</ContextMenu>
							</TooltipTrigger>
							<TooltipContent className="m-1 border-2 border-neutral-700 bg-neutral-50 p-2 dark:bg-neutral-950">
								<p className="font-mono text-xs font-semibold text-neutral-800 dark:text-neutral-300">
									Right click to edit weather settings.
								</p>
							</TooltipContent>
						</Tooltip>

						{/* <ToggleGroupItem
						value="minigames"
						className="flex aspect-square h-auto w-auto items-center justify-center rounded-lg border-2 border-neutral-700 p-3 text-red-800/70 hover:bg-neutral-200 dark:bg-neutral-800 hover:text-red-400 data-[state=on]:bg-neutral-900 data-[state=on]:text-red-600 data-[state=on]:hover:bg-neutral-200 dark:bg-neutral-800 data-[state=on]:hover:text-red-500">
						<FaGamepad className="size-7" />
						</ToggleGroupItem> */}
					</ToggleGroup>
				</PopoverContent>
			</Popover>
		</TooltipProvider>
	);
}
