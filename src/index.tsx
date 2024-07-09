// TODO: Offline version

import { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import Clock from './components/Clock';
import Countdown from './components/Countdown';
import Settings from './components/Settings';
import Spotify from './components/Spotify';
import './index.css';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/shadcn/components/ui/carousel';
import { useWindowSize } from '@uidotdev/usehooks';

export const RedirContext = createContext<{
	redirNeeded: boolean | null;
	setRedirNeeded: (s: boolean) => void;
	countdowns: Countdown[];
	setCountdowns: (s: Countdown[]) => void;
}>({
	redirNeeded: null,
	setRedirNeeded: () => undefined,
	countdowns: [],
	setCountdowns: () => undefined,
});
export function App() {
	const [spotify, setSpotify] = useState<boolean>(false);
	const [countdown, setCountdown] = useState<boolean>(false);
	const [weather, setWeather] = useState<boolean>(false);

	const [unit, setUnit] = useState<string>(localStorage.unit || 'f');
	const [countdowns, setCountdowns] = useState<Countdown[]>(
		JSON.parse(localStorage.countdowns || '[]'),
	);

	const [redirNeeded, setRedirNeeded] = useState<boolean>(false);

	const [dark, setDark] = useState<boolean>(localStorage.theme === 'dark');

	const size = useWindowSize();

	useEffect(() => {
		localStorage.setItem('theme', dark ? 'dark' : 'light');

		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) &&
				window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [dark]);

	return (
		<RedirContext.Provider
			value={{ redirNeeded, setRedirNeeded, countdowns, setCountdowns }}>
			{(dark || !dark) && (
				<div className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-50 dark:bg-neutral-950">
					<Toaster />
					<Clock unit={unit} weather={weather} />
					{(size.width || 0) < 640 ? (
						<div className="fixed bottom-0 flex w-full sm:hidden">
							<Carousel
								opts={{
									loop: true,
								}}
								className="flex w-full">
								<CarouselContent className="flex w-full items-end">
									{spotify && (
										<CarouselItem className="w-full">
											{(redirNeeded || !redirNeeded) && <Spotify />}
										</CarouselItem>
									)}
									<CarouselItem>
										<div className="flex w-full flex-row items-end justify-between">
											<Settings
												setSpotify={setSpotify}
												setCountdown={setCountdown}
												setUnit={setUnit}
												setWeather={setWeather}
												setCountdowns={setCountdowns}
												setDark={setDark}
												dark={dark}
												countdowns={countdowns}
											/>
											{countdown && <Countdown cds={countdowns} />}
										</div>
									</CarouselItem>
								</CarouselContent>
							</Carousel>
						</div>
					) : (
						<div className="fixed bottom-0 hidden h-max w-full justify-center sm:flex">
							<div className="fixed bottom-0 left-0 flex flex-row">
								<Settings
									setSpotify={setSpotify}
									setCountdown={setCountdown}
									setUnit={setUnit}
									setWeather={setWeather}
									setCountdowns={setCountdowns}
									setDark={setDark}
									dark={dark}
									countdowns={countdowns}
								/>
							</div>
							{spotify && (redirNeeded || !redirNeeded) && <Spotify />}
							{countdown && <Countdown cds={countdowns} />}
						</div>
					)}
				</div>
			)}
		</RedirContext.Provider>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
