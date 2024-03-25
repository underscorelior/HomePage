// TODO: Switch to cookies
// FIX HOVER FOR SPOTIFY AND FIX GAMRPAD COLOR
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
	// AlertDialogCancel,
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
// import { FaTasks } from 'react-icons/fa';
import { FaGamepad } from 'react-icons/fa6';
import { TiWeatherCloudy } from 'react-icons/ti';

function ApiKeyPopup() {
	function saveKeys() {}

	return (
		<AlertDialog>
			<AlertDialogTrigger className="mx-auto mt-4 w-max rounded-lg border-2 border-neutral-700 p-3 font-semibold text-neutral-300 outline-none">
				API Keys
			</AlertDialogTrigger>
			<AlertDialogContent className="border-2 border-neutral-700 bg-neutral-950">
				<AlertDialogHeader>
					<AlertDialogTitle className="pb-3 text-center text-3xl font-bold tracking-wide text-neutral-300">
						API Keys
					</AlertDialogTitle>
					<AlertDialogDescription>
						<div className="flex flex-col gap-y-4">
							<div className="flex flex-row gap-x-4">
								<TiWeatherCloudy className="h-10 w-10 text-orange-300" />
								<Input
									placeholder="OpenWeatherMap API Key"
									type="password"
									className="w-full rounded-lg border-neutral-700 bg-neutral-950 px-3 text-lg text-neutral-400 placeholder-stone-200 outline-none ring-2 ring-neutral-700 placeholder:font-bold focus:outline-stone-800 active:outline-stone-800"
								/>
							</div>
							<div className="flex flex-row gap-x-4">
								<SiSpotify className="h-10 w-10 text-green-400" />
								<Input
									placeholder="Spotify Client ID"
									type="password"
									className="w-full rounded-lg border-neutral-700 bg-neutral-950 px-3 text-lg text-neutral-400 placeholder-stone-200 outline-none ring-2 ring-neutral-700 placeholder:font-bold focus:outline-stone-800 active:outline-stone-800"
								/>
							</div>
						</div>
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					{/* <AlertDialogCancel>Cancel</AlertDialogCancel> */}
					<AlertDialogAction
						className="border-2 border-neutral-700 bg-neutral-950"
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
	// setTasks,
	setMinigames,
}: {
	setSpotify: (s: boolean) => void;
	// setTasks: (s: boolean) => void;
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

		// [values, change] = handleCheck('tasks', values);
		// setTasks(change);

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
		// setTasks(s.includes('tasks'));
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
				<div className="flex h-14 w-14 items-center justify-center rounded-lg bg-neutral-950 p-4 ring-2 ring-neutral-800 transition-all duration-200 ease-in-out hover:bg-neutral-900">
					<FiSettings className="h-10 w-10 text-stone-300" size={'4em'} />
				</div>
			</PopoverTrigger>
			<PopoverContent className="mb-1 ml-2 flex w-full flex-col rounded-lg border-[3px] border-neutral-700 bg-neutral-950 p-4">
				<ToggleGroup
					type="multiple"
					className="space-x-2"
					defaultValue={toggleVal}
					onValueChange={(value) => toggleValues(value)}>
					<ToggleGroupItem
						value="spotify"
						className="flex aspect-square h-auto w-auto items-center justify-center rounded-lg border-2 border-neutral-700 p-3 text-green-800/70 hover:bg-neutral-800 hover:text-green-400 data-[state=on]:bg-neutral-900 data-[state=on]:text-green-500">
						<SiSpotify className="h-7 w-7" />
					</ToggleGroupItem>
					{/* <ToggleGroupItem
						value="tasks"
						className="hover:bg-neutral-800 data-[state=on]:bg-neutral-900 flex aspect-square h-auto w-auto items-center justify-center rounded-lg border-2 border-neutral-700 p-3">
						<FaTasks className=" text-ctp-sapphire h-7 w-7" />
					</ToggleGroupItem> */}
					<ToggleGroupItem
						value="minigames"
						className="flex aspect-square h-auto w-auto items-center justify-center rounded-lg border-2 border-neutral-700 p-3 text-red-800/70 hover:bg-neutral-800 hover:text-red-400 data-[state=on]:bg-neutral-900 data-[state=on]:text-red-600 data-[state=on]:hover:bg-neutral-800 data-[state=on]:hover:text-red-500">
						<FaGamepad className="h-7 w-7" />
					</ToggleGroupItem>
				</ToggleGroup>
				<button
					onClick={() => resetSpotifyData()}
					className="mt-4 flex flex-col rounded-lg border-2 border-neutral-700 p-3 font-semibold text-neutral-300">
					Reset Spotify Data{' '}
					<span className="text-xs font-medium text-neutral-400">
						(Use if the spotify widget isn't loading.)
					</span>
				</button>
				<ApiKeyPopup />
				{/* <span className=" text-neutral-400 pt-4 text-xs font-medium">
					(Press the "s" key to toggle the settings button.)
				</span> */}
			</PopoverContent>
		</Popover>
	);
}
