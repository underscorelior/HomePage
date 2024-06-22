// TODO: Custom times and dates using settings.

import { useEffect, useState } from 'react';

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
	}, []);
	return (
		<div className="fixed bottom-0 right-0 flex flex-col rounded-tl-lg border-l-2 border-t-2 border-neutral-800 bg-neutral-950 p-4 text-xl font-bold">
			{countdowns.map((cd, i) => (
				<span className="flex flex-col text-zinc-300" key={i}>
					{cd.name}:
					<span className="text-end font-mono font-semibold">
						{calcDiff(cd.timestamp)}
					</span>
				</span>
			))}
		</div>
	);
}

export default Countdown;
