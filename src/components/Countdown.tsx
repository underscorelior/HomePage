// TODO: Highlight active date on calendar -- NOT SURE IF POSSIBLE
// TODO: Sorting

import { Button } from '@/shadcn/components/ui/button';
import { DateTimePicker } from '@/shadcn/components/ui/date-time-picker/date-time-picker';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shadcn/components/ui/dialog';
import { Input } from '@/shadcn/components/ui/input';
import { Label } from '@/shadcn/components/ui/label';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shadcn/components/ui/tooltip';
import { parseAbsolute } from '@internationalized/date';
import { useEffect, useState } from 'react';
import {
	TbCalendarCog,
	TbCalendarPlus,
	TbCheck,
	TbClipboard,
	TbTrash,
} from 'react-icons/tb';

import { Checkbox } from '@/shadcn/components/ui/checkbox';
import { Textarea } from '@/shadcn/components/ui/textarea';
import { BiExport, BiImport } from 'react-icons/bi';
import toast from 'react-hot-toast';

function Countdown({ cds }: { cds: Countdown[] }) {
	const [countdowns, setCountdowns] = useState<Countdown[]>([]);

	function calcDiff(diff: number) {
		diff -= Date.now();

		if (diff <= 0) {
			return 'Completed! 🎉';
		}

		let days = Math.floor(diff / (1000 * 60 * 60 * 24)).toString();
		let hours = Math.floor(
			(diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
		).toString();
		let mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)).toString();
		let secs = Math.floor((diff % (1000 * 60)) / 1000).toString();

		days = '0'.repeat(3 - days.length) + days + 'd';
		hours = '0'.repeat(2 - hours.length) + hours + 'h';
		mins = '0'.repeat(2 - mins.length) + mins + 'm';
		secs = '0'.repeat(2 - secs.length) + secs + 's';

		return [days, hours, mins, secs].join(' ');
	}

	useEffect(() => {
		const interval = setInterval(() => {
			setCountdowns(
				cds.map((cd) => ({
					...cd,
					cooldown: calcDiff(cd.timestamp),
				})),
			);
		}, 1);

		return () => {
			clearInterval(interval);
		};
	}, [cds]);
	return (
		<div className="fixed bottom-0 right-0 flex max-w-[20%] flex-col rounded-tl-lg border-l-2 border-t-2 border-neutral-600 bg-neutral-50 p-4 text-xl font-bold dark:border-neutral-800 dark:bg-neutral-950">
			{countdowns.length == 0 ? (
				<h3 className="text-zinc-800 dark:text-zinc-300">
					There are no currently active countdowns.
				</h3>
			) : (
				countdowns.map((cd, i) => (
					<span
						className="flex flex-col text-zinc-800 dark:text-zinc-300"
						key={i}>
						{cd.name}:
						<span className="font-mono text-lg font-semibold">
							{calcDiff(cd.timestamp)}
						</span>
					</span>
				))
			)}
		</div>
	);
}

export default Countdown;

export function CountdownItem({
	name,
	timestamp,
	setCountdowns,
	countdowns,
	globalOpen,
	setGlobalOpen,
}: {
	name: string;
	timestamp: number;
	setCountdowns: (s: Countdown[]) => void;
	countdowns: Countdown[];
	globalOpen: boolean;
	setGlobalOpen: (x: boolean) => void;
}) {
	const [ts, setTs] = useState<number>(timestamp);
	const [cdName, setName] = useState<string>(name);

	useEffect(() => {
		setTs(ts);
		setName(cdName);
	}, [ts, cdName]);

	function syncCountdowns(newName: string, newTimestamp: number) {
		const cds = countdowns.map((cd) => {
			if (cd.name == name) {
				return {
					name: newName,
					timestamp: newTimestamp,
				};
			} else {
				return cd;
			}
		});
		cds.sort((a, b) => a.timestamp - b.timestamp);
		localStorage.setItem('countdowns', JSON.stringify(cds));
		setCountdowns(cds);
	}

	function deleteCountdown() {
		const cds: Countdown[] = [];
		countdowns.map((cd) => {
			if (cd.name != name) {
				cds.push(cd);
			}
		});

		localStorage.setItem('countdowns', JSON.stringify(cds));
		setCountdowns(cds);
	}

	return (
		<div className="flex flex-row items-center justify-between gap-4 rounded-lg border-[1.5px] border-neutral-500 px-3 py-2 dark:border-neutral-700">
			<div className="flex flex-col">
				<h3 className="font-medium">{cdName}</h3>
				<p className="font-mono text-sm">
					{new Date(ts).toLocaleString([], {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour12: true,
						hour: '2-digit',
						minute: '2-digit',
					})}
				</p>
			</div>
			<CountdownEditPopup
				name={cdName}
				timestamp={ts}
				countdowns={countdowns}
				setOuterTimestamp={setTs}
				setOuterName={setName}
				syncCountdowns={syncCountdowns}
				deleteCountdown={deleteCountdown}
				globalOpen={globalOpen}
				setGlobalOpen={setGlobalOpen}
			/>
		</div>
	);
}

function CountdownEditPopup({
	name,
	timestamp,
	countdowns,
	setOuterTimestamp,
	setOuterName,
	syncCountdowns,
	deleteCountdown,
	globalOpen,
	setGlobalOpen,
}: {
	name: string;
	timestamp: number;
	countdowns: Countdown[];
	setOuterTimestamp: (timestamp: number) => void;
	setOuterName: (name: string) => void;
	syncCountdowns: (name: string, timestamp: number) => void;
	deleteCountdown: () => void;
	globalOpen: boolean;
	setGlobalOpen: (x: boolean) => void;
}) {
	const [ts, setTimestamp] = useState<number>(timestamp);
	const [cdName, setName] = useState<string>(name);
	const [open, setOpen] = useState<boolean>(false);
	const [shift, setShift] = useState<boolean>(false);

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.shiftKey && (!open || !globalOpen)) {
				setShift(true);
			}
		}

		function handleKeyUp(event: KeyboardEvent) {
			if (event.key == 'Shift' && (!open || !globalOpen)) {
				setShift(false);
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('keyup', handleKeyUp);

		return () => {
			window.removeEventListener('keydown', handleKeyDown);
			window.removeEventListener('keyup', handleKeyUp);
		};
	}, [globalOpen, open]);

	function onSubmit() {
		setOpen(false);
		syncCountdowns(cdName, ts);
		setOuterTimestamp(ts);
		setOuterName(cdName);
	}

	function nameExists(): boolean {
		let ret = false;
		countdowns.map((cd) => {
			if (cd.name === cdName && cdName !== name) {
				ret = true;
			}
		});
		return ret;
	}

	return (
		<>
			{!shift || open || globalOpen ? (
				<Dialog
					open={open}
					onOpenChange={(x) => {
						setOpen(x);
						setGlobalOpen(x);
					}}>
					<DialogTrigger className="flex aspect-square size-auto rounded-lg border border-neutral-400 p-2 dark:border-neutral-500">
						<TbCalendarCog />
					</DialogTrigger>
					<DialogContent className="sm:max-w-[425px] dark:text-neutral-100">
						<DialogHeader>
							<DialogTitle className="text-2xl font-semibold dark:text-neutral-100">
								Editing: {name}
							</DialogTitle>
						</DialogHeader>
						<div className="flex flex-col gap-y-2 py-4">
							<Label htmlFor="name">Name</Label>
							<Input
								id="name"
								className="mb-3"
								defaultValue={name}
								onChange={(x) => setName(x.target.value)}
							/>

							<Label htmlFor="time">Time</Label>
							<DateTimePicker
								defaultValue={parseAbsolute(
									new Date(timestamp).toISOString(),
									Intl.DateTimeFormat().resolvedOptions().timeZone,
								)}
								minValue={parseAbsolute(
									new Date().toISOString(),
									Intl.DateTimeFormat().resolvedOptions().timeZone,
								)}
								granularity={'minute'}
								onChange={(dv) => {
									setTimestamp(
										dv
											.toDate(Intl.DateTimeFormat().resolvedOptions().timeZone)
											.getTime(),
									);
								}}
							/>
						</div>
						<DialogFooter className="flex w-full flex-row gap-2">
							<DialogClose>
								<Button variant="ghost">Cancel</Button>
							</DialogClose>
							<Button
								type="submit"
								onClick={() => onSubmit()}
								disabled={
									Date.now() >= ts || nameExists() || cdName.trim().length == 0
								}>
								Save
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			) : (
				<button
					className="flex size-auto h-full w-auto rounded-lg border border-neutral-400 bg-red-500 p-2 text-white hover:bg-red-500/80 dark:border-neutral-500"
					onClick={() => deleteCountdown()}>
					<TbTrash />
				</button>
			)}
		</>
	);
}

export function CountdownCreatePopup({
	setCountdowns,
	countdowns,
	setGlobalOpen,
}: {
	setCountdowns: (s: Countdown[]) => void;
	countdowns: Countdown[];
	setGlobalOpen: (x: boolean) => void;
}) {
	const [timestamp, setTimestamp] = useState<number>(Date.now());
	const [name, setName] = useState<string>('');
	const [open, setOpen] = useState<boolean>(false);

	function saveCountdown() {
		setOpen(false);
		const cds = [...countdowns, { name: name, timestamp: timestamp }];
		localStorage.setItem('countdowns', JSON.stringify(cds));
		setCountdowns(cds);
		setTimestamp(Date.now());
		setName('');
	}

	function nameExists(): boolean {
		let ret = false;
		countdowns.map((cd) => {
			if (cd.name === name) {
				ret = true;
			}
		});
		return ret;
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(x) => {
				setOpen(x);
				setGlobalOpen(x);
			}}>
			<DialogTrigger className="aspect-square h-max w-max rounded-lg border-[1.5px] border-neutral-500 p-3 dark:border-neutral-600">
				<TbCalendarPlus />
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] dark:text-neutral-100">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold dark:text-neutral-100">
						Create Countdown
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-y-2 py-4">
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						className="mb-3"
						defaultValue={name}
						onChange={(x) => {
							setName(x.target.value);
						}}
					/>

					<Label htmlFor="time">Time</Label>
					<DateTimePicker
						defaultValue={parseAbsolute(
							new Date(timestamp).toISOString(),
							Intl.DateTimeFormat().resolvedOptions().timeZone,
						)}
						minValue={parseAbsolute(
							new Date().toISOString(),
							Intl.DateTimeFormat().resolvedOptions().timeZone,
						)}
						granularity={'minute'}
						onChange={(dv) => {
							setTimestamp(
								dv
									.toDate(Intl.DateTimeFormat().resolvedOptions().timeZone)
									.getTime(),
							);
						}}
					/>
				</div>
				<DialogFooter className="flex w-full flex-row gap-2">
					<DialogClose>
						<Button variant="ghost">Cancel</Button>
					</DialogClose>
					<Button
						type="submit"
						onClick={() => saveCountdown()}
						disabled={
							Date.now() >= timestamp || nameExists() || name.trim().length == 0
						}>
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function CountdownIO({
	setCountdowns,
	countdowns,
	setGlobalOpen,
}: {
	setCountdowns: (s: Countdown[]) => void;
	countdowns: Countdown[];
	setGlobalOpen: (x: boolean) => void;
}) {
	const [importOpen, setImportOpen] = useState<boolean>(false);
	const [inJSON, setInJSON] = useState<string>('');

	const [exportOpen, setExportOpen] = useState<boolean>(false);
	const [exportList, setExportList] = useState<Countdown[]>(countdowns);
	const [exptJSON, setExptJSON] = useState<string>(JSON.stringify(exportList));
	const [copy, setCopy] = useState<boolean>(false);

	function saveCountdown() {
		try {
			setCountdowns(JSON.parse(inJSON));
			localStorage.setItem('countdowns', inJSON);
			setImportOpen(false);
		} catch {
			toast.error('The inputted JSON is invalid! Try again.');
		}
	}

	function modifyFromName(name: string, c: boolean | string) {
		let cds: Countdown[] = [];

		if (c) {
			cds = exportList;
			countdowns.map((cd) => {
				if (cd.name === name) {
					cds.push(cd);
				}
			});
		} else {
			exportList.map((cd) => {
				if (cd.name !== name) {
					cds.push(cd);
				}
			});
		}

		cds.sort((a, b) => a.timestamp - b.timestamp);
		setExportList(cds);
		setExptJSON(JSON.stringify(cds));
	}

	return (
		<div className="flex flex-row gap-1">
			<Dialog
				open={importOpen}
				onOpenChange={(x) => {
					setImportOpen(x);
					setGlobalOpen(x);
				}}>
				<DialogTrigger className="aspect-square h-max w-max rounded-lg border-[1.5px] border-neutral-500 p-3 dark:border-neutral-600">
					<BiImport />
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] dark:text-neutral-100">
					<DialogHeader>
						<DialogTitle className="text-2xl font-semibold dark:text-neutral-100">
							Import Countdowns from JSON
						</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-y-2 py-4">
						<Textarea
							placeholder="Input JSON here. Format: [{name: '', timestamp: #}, ...]"
							onChange={(e) => setInJSON(e.target.value)}
						/>
					</div>
					<DialogFooter className="flex w-full flex-row gap-2">
						<DialogClose>
							<Button variant="ghost">Cancel</Button>
						</DialogClose>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger>
									<Button
										variant="destructive"
										type="submit"
										onClick={() => {
											saveCountdown();
										}}>
										Save
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p className="max-w-[20dvh] text-center">
										WARNING! This will override all of your current countdowns.
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</DialogFooter>
				</DialogContent>
			</Dialog>
			<Dialog
				open={exportOpen}
				onOpenChange={(x) => {
					setExportOpen(x);
					setGlobalOpen(x);
				}}>
				<DialogTrigger className="aspect-square h-max w-max rounded-lg border-[1.5px] border-neutral-500 p-3 dark:border-neutral-600">
					<BiExport />
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px] dark:text-neutral-100">
					<DialogHeader className="flex flex-row items-center justify-between">
						<DialogTitle className="text-2xl font-semibold dark:text-neutral-100">
							Export Countdowns to JSON
						</DialogTitle>
					</DialogHeader>
					<div className="flex flex-col gap-y-3 py-4">
						<div className="flex flex-col gap-2">
							{countdowns.map((cd) => {
								return (
									<span className="flex flex-row items-center gap-2">
										<Checkbox
											id={cd.name}
											defaultChecked
											onCheckedChange={(c) => {
												modifyFromName(cd.name, c);
											}}
										/>
										<Label htmlFor={cd.name} className="text-lg font-medium">
											{cd.name}
										</Label>
									</span>
								);
							})}
						</div>
						<div className="flex flex-col gap-1">
							<h3 className="pb-1 text-xl font-semibold">Output</h3>
							<Textarea value={exptJSON} readOnly />
						</div>
					</div>
					<DialogFooter className="flex w-full flex-row gap-2">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger
									className="flex aspect-square size-auto items-center justify-center rounded-lg border-[1.5px] border-neutral-500 p-2 dark:border-neutral-600"
									onClick={async () => {
										navigator.clipboard.writeText(exptJSON);
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

						<DialogClose>
							<Button>Close</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
