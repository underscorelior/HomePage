// TOOD: Custom times and dates using settings.

import { useEffect, useState } from 'react';

function Countdown() {
	const [junior, setJunior] = useState<string>('');
	const [hs, setHS] = useState<string>('');

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
			setJunior(calcDiff(1717698600000));
			setHS(calcDiff(1748634300000));
		}, 1);

		return () => {
			clearInterval(interval);
		};
	}, []);
	return (
		<div className="fixed bottom-0 right-0 flex flex-col rounded-tl-lg border-l-2 border-t-2 border-neutral-800 bg-neutral-950 p-4 text-xl font-bold">
			{/* <span className="animate-gradient bg-1000% flex flex-col bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
				Junior Year Over:
				<span className="text-end font-mono font-semibold">{junior}</span>
			</span>

			<span className="animate-gradient bg-1000% flex flex-col bg-gradient-to-r from-blue-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
				End of HS:
				<span className="text-end font-mono font-semibold">{hs}</span>
			</span> */}
			<span className="animate-gradient bg-1000% flex flex-col text-zinc-300">
				Junior Year Over:
				<span className="text-end font-mono font-semibold">{junior}</span>
			</span>
			<span className="animate-gradient bg-500% flex flex-col text-zinc-300">
				End of HS:
				<span className="text-end font-mono font-semibold">{hs}</span>
			</span>
		</div>
	);
}

export default Countdown;
