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
		<section className='font-black text-5xl lg:text-6xl mb-4 bg-gradient-to-r bg-clip-text text-transparent from-ctp-blue via-ctp-mauve to-ctp-blue bg-500% animate-gradient p-6'>
			{formattedTime}
			<p className='text-xl text-end'>{formattedDate}</p>
		</section>
	);
}

export default Clock;
