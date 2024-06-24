// TODO: Custom times and dates using settings.

import { Button } from '@/shadcn/components/ui/button';
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
import { useEffect, useState } from 'react';
import { TiCalendar } from 'react-icons/ti';
import { parseAbsolute } from '@internationalized/date';

import { DateTimePicker } from '@/shadcn/components/ui/date-time-picker/date-time-picker';

function Countdown({ cds }: { cds: { name: string; timestamp: number }[] }) {
	const [countdowns, setCountdowns] = useState<
		{ name: string; timestamp: number; cooldown: string }[]
	>([]);

	function calcDiff(diff: number) {
		diff -= Date.now();

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
		<div className="fixed bottom-0 right-0 flex flex-col rounded-tl-lg border-l-2 border-t-2 border-neutral-600 bg-neutral-50 p-4 text-xl font-bold dark:border-neutral-800 dark:bg-neutral-950">
			{countdowns.map((cd, i) => (
				<span
					className="flex flex-col text-zinc-800 dark:text-zinc-300"
					key={i}>
					{cd.name}:
					<span className="text-end font-mono text-lg font-semibold">
						{calcDiff(cd.timestamp)}
					</span>
				</span>
			))}
		</div>
	);
}

export default Countdown;

export function CountdownItem({
	name = 'Placeholder name',
	timestamp = Date.now(),
}: {
	name: string;
	timestamp: number;
}) {
	const [ts, setTs] = useState<number>(timestamp);
	const [cdName, setName] = useState<string>(name);

	useEffect(() => {
		setTs(ts);
		console.log(ts + 'AAAAAAAAAAAAAAAAAAAA');
	}, [ts]);

	return (
		<div className="flex flex-row items-center justify-center gap-4 rounded-lg border-[1.5px] border-neutral-500 px-3 py-2 dark:border-neutral-700">
			<div className="flex flex-col">
				<h3 className="font-medium">{cdName}</h3>
				<p className="font-mono text-sm">{new Date(ts).toLocaleString()}</p>
			</div>
			<CountdownEditPopup
				name={cdName}
				timestamp={ts}
				setOuterTimestamp={setTs}
				setOuterName={setName}
			/>
			{/* Add delete on pressing shift */}
		</div>
	);
}

function CountdownEditPopup({
	name,
	timestamp,
	setOuterTimestamp,
	setOuterName,
}: {
	name: string;
	timestamp: number;
	setOuterTimestamp: (timestamp: number) => void;
	setOuterName: (name: string) => void;
}) {
	const [ts, setTimestamp] = useState<number>(timestamp);
	const [cdName, setName] = useState<string>(name);
	const [open, setOpen] = useState(false);

	function onSubmit() {
		setOpen(false);
		console.log('AAAAAAAAAAAAAAAAAAAAA');
		setOuterTimestamp(ts);
		setOuterName(cdName);
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger className="flex aspect-square size-auto rounded-lg border border-neutral-400 p-2 dark:border-neutral-500">
				<TiCalendar />
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] dark:text-neutral-100">
				<DialogHeader>
					<DialogTitle className="text-2xl font-semibold dark:text-neutral-100">
						Editing: {name}
					</DialogTitle>
				</DialogHeader>
				<div className="grid grid-cols-[15%,85%] grid-rows-2 items-center justify-start gap-y-4 py-4">
					{/* <div className="flex flex-col gap-y-2 py-4"> */}
					<Label htmlFor="name">Name</Label>
					<Input id="name" defaultValue={name} />
					{/* <Input id="name" className="mb-3" defaultValue={name} /> */}

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
					<Button type="submit">Save</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
