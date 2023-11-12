import { useState, useEffect } from 'react';

function Clock() {
	const [currentTime, setCurrentTime] = useState(new Date());

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	const formattedTime = currentTime.toLocaleTimeString('en-US', {
		hour12: true,
		hour: 'numeric',
		minute: 'numeric',
	});

	const formattedDate = currentTime.toLocaleDateString('en-US', {
		weekday: 'long',
		month: 'long',
		day: 'numeric',
	});

	return (
		<section className="mb-4 animate-gradient bg-gradient-to-r from-ctp-blue via-ctp-mauve to-ctp-blue bg-500% bg-clip-text p-6 text-5xl font-black text-transparent lg:text-6xl">
			{formattedTime}
			<p className="text-end text-xl">{formattedDate}</p>
		</section>
	);
}

export default Clock;
