// TODO: Switch to cookies

import { useEffect, useState } from 'react';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/shadcn/components/popover';
import { ToggleGroup, ToggleGroupItem } from '@/shadcn/components/toggle-group';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/shadcn/components/alert-dialog';
import { Input } from '@/shadcn/components/ui/input';

import { FiSettings } from 'react-icons/fi';
import { SiSpotify } from 'react-icons/si';
import { FaTasks } from 'react-icons/fa';
import { FaGamepad } from 'react-icons/fa6';
import { TiWeatherCloudy } from 'react-icons/ti';

function ApiKeyPopup() {
	function saveKeys() {}

	return (
		<AlertDialog>
			<AlertDialogTrigger>
				<button className=" text-ctp-text mt-4 rounded-lg border-2 border-neutral-700 p-3 font-semibold">
					API Keys
				</button>
			</AlertDialogTrigger>
			<AlertDialogContent className="bg-ctp-crust border-ctp-surface1 border-2">
				<AlertDialogHeader>
					<AlertDialogTitle className=" text-ctp text pb-3 text-center text-3xl font-bold tracking-wide">
						API Keys
					</AlertDialogTitle>
					<AlertDialogDescription>
						<div className="flex flex-col gap-y-4">
							<div className="flex flex-row gap-x-4">
								<TiWeatherCloudy className=" text-ctp-sky h-10 w-10" />
								<Input
									placeholder="OpenWeatherMap API Key"
									type="password"
									className="bg-ctp-crust text-ctp text placeholder-ctp-surface2 focus:-outline-ctp-overlay2 focus:outline-ctp-surface2 active:-outline-ctp-surface2 w-full rounded-lg border-neutral-700 px-3 text-lg outline-none ring-2 ring-neutral-700 placeholder:font-bold"
								/>
							</div>
							<div className="flex flex-row gap-x-4">
								<SiSpotify className=" text-ctp-green h-10 w-10" />
								<Input
									placeholder="Spotify Client ID"
									type="password"
									className="bg-ctp-crust  text-ctp text placeholder-ctp-surface2 focus:-outline-ctp-overlay2 focus:outline-ctp-surface2 active:-outline-ctp-surface2 w-full rounded-lg border-neutral-700 px-3 text-lg outline-none ring-2 ring-neutral-700 placeholder:font-bold"
								/>
							</div>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					{/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
					<AlertDialogAction
						className="bg-ctp-crust border-2 border-neutral-700"
						onClick={() => saveKeys()}>
						Save
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export default function Settings({
	setSpotify,
	setTasks,
	setMinigames,
}: {
	setSpotify: (s: boolean) => void;
	setTasks: (s: boolean) => void;
	setMinigames: (s: boolean) => void;
	setSettingsOpen: (s: boolean) => void;
	settingsOpen: boolean;
}) {
	const [toggleVal, setToggleVal] = useState<string[]>([]);

	function checkValues() {
		let values: string[] = [];
		let change: boolean = false;

		[values, change] = handleCheck('spotify', values);
		setSpotify(change);

		[values, change] = handleCheck('tasks', values);
		setTasks(change);

		[values, change] = handleCheck('minigames', values);
		setMinigames(change);

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
		localStorage.setItem('is_tasks', s.includes('tasks').toString());
		localStorage.setItem('is_minigames', s.includes('minigames').toString());

		setToggleVal(s);
		setSpotify(s.includes('spotify'));
		setTasks(s.includes('tasks'));
		setMinigames(s.includes('minigames'));
	}

	useEffect(() => {
		checkValues();
	}, []);

	function resetSpotifyData(): void {
		throw new Error('Function not implemented.');
	}

	return (
		<Popover>
			<PopoverTrigger className="m-4 mr-2 w-full" onClick={() => checkValues()}>
				<div className="bg-ctp-crust hover:bg-ctp-base flex h-14 w-14 items-center justify-center rounded-lg p-4 ring-[3px] ring-neutral-700 transition-all duration-200 ease-in-out">
					<FiSettings className=" text-ctp-sky h-10 w-10" size={'4em'} />
				</div>
			</PopoverTrigger>
			<PopoverContent className="bg-ctp-crust mb-1 ml-2 flex w-full flex-col rounded-lg border-[3px] border-neutral-700 p-4">
				<ToggleGroup
					type="multiple"
					className="space-x-2"
					defaultValue={toggleVal}
					onValueChange={(value) => toggleValues(value)}>
					<ToggleGroupItem
						value="spotify"
						className="hover:bg-ctp-mantle data-[state=on]:bg-ctp-base flex aspect-square h-auto w-auto items-center justify-center rounded-lg border-2 border-neutral-700 p-3">
						<SiSpotify className=" text-ctp-sapphire h-7 w-7" />
					</ToggleGroupItem>
					<ToggleGroupItem
						value="tasks"
						className="hover:bg-ctp-mantle data-[state=on]:bg-ctp-base flex aspect-square h-auto w-auto items-center justify-center rounded-lg border-2 border-neutral-700 p-3">
						<FaTasks className=" text-ctp-sapphire h-7 w-7" />
					</ToggleGroupItem>
					<ToggleGroupItem
						value="minigames"
						className="hover:bg-ctp-mantle data-[state=on]:bg-ctp-base flex aspect-square h-auto w-auto items-center justify-center rounded-lg border-2 border-neutral-700 p-3">
						<FaGamepad className=" text-ctp-sapphire h-7 w-7" />
					</ToggleGroupItem>
				</ToggleGroup>
				<button
					onClick={() => resetSpotifyData()}
					className=" text-ctp-text mt-4 flex flex-col rounded-lg border-2 border-neutral-700 p-3 font-semibold">
					Reset Spotify Data{' '}
					<span className=" text-ctp-subtext0 text-xs font-medium">
						(Use if the spotify widget isn't loading.)
					</span>
				</button>
				<ApiKeyPopup />
				{/* <span className=" text-ctp-subtext0 pt-4 text-xs font-medium">
					(Press the "s" key to toggle the settings button.)
				</span> */}
			</PopoverContent>
		</Popover>
	);
}
