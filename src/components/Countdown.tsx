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
import { TiCalendar, TiTrash } from 'react-icons/ti';
import { FaTrashAlt } from 'react-icons/fa';
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
	return (
		<div className="flex flex-row items-center justify-center gap-4 rounded-lg border-[1.5px] px-3 py-2 dark:border-neutral-700">
			<div className="flex flex-col">
				<h3 className="font-medium">{name}</h3>
				<p className="font-mono text-sm">
					{new Date(timestamp).toLocaleString()}
				</p>
			</div>
			<CountdownEditPopup name={name} timestamp={timestamp} />
		</div>
	);
}

function CountdownEditPopup({
	name,
	timestamp,
}: {
	name: string;
	timestamp: number;
}) {
	return (
		// <Dialog>
		// 	<DialogTrigger className="flex aspect-square size-auto rounded-lg border border-neutral-500 p-2">
		// 		<TiCalendar />
		// 	</DialogTrigger>
		// 	<DialogContent>
		// 		<DialogHeader>
		// 			<DialogTitle className="text-center text-2xl font-semibold dark:text-neutral-100">
		// 				Editing: {name}
		// 			</DialogTitle>
		// 		</DialogHeader>
		// 		<DialogClose>{name}</DialogClose>
		// 	</DialogContent>
		// </Dialog>
		<Dialog>
			<DialogTrigger className="flex aspect-square size-auto rounded-lg border border-neutral-500 p-2">
				<TiCalendar />
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] dark:text-neutral-100">
				<DialogHeader>
					<DialogTitle>Editing: {name}</DialogTitle>
				</DialogHeader>
				<div className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Name
						</Label>
						<Input id="name" defaultValue={name} className="col-span-3" />
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="time" className="text-right">
							Time
						</Label>

						<DateTimePicker />
					</div>
				</div>
				<DialogFooter className="flex w-full flex-row sm:justify-between">
					<Button
						variant={'outline'}
						className="flex aspect-square h-full w-auto items-center justify-center self-start p-2 text-red-500/90 dark:hover:text-red-500">
						<FaTrashAlt />
					</Button>
					<div className="flex gap-2">
						<DialogClose>
							<Button variant="ghost">Cancel</Button>
						</DialogClose>
						<Button type="submit">Save</Button>
					</div>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
