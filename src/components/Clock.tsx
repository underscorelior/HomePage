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
		<section className="animate-gradient from-ctp-blue via-ctp-mauve to-ctp-blue bg-500% mb-4 bg-gradient-to-r bg-clip-text p-6 text-5xl font-black text-transparent lg:text-[4.25rem]">
			{formattedTime}
			<p className="text-end text-[1.625rem]">{formattedDate}</p>
		</section>
	);
}

export default Clock;
