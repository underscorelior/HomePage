import { createContext, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import Clock from './components/Clock';
import Countdown from './components/Countdown';
import Settings from './components/Settings';
import Spotify from './components/Spotify';
import './index.css';

export const RedirContext = createContext<{
	redirNeeded: boolean | null;
	setRedirNeeded: (s: boolean) => void;
}>({
	redirNeeded: null,
	setRedirNeeded: () => undefined,
});
export function App() {
	const [spotify, setSpotify] = useState<boolean>(false);
	const [countdown, setCountdown] = useState<boolean>(false);
	const [weather, setWeather] = useState<boolean>(false);

	const [temp, setTemp] = useState<string>(localStorage.getItem('temp') || 'c');

	const [redirNeeded, setRedirNeeded] = useState<boolean>(false);

	return (
		<RedirContext.Provider value={{ redirNeeded, setRedirNeeded }}>
			<div className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-950">
				<Toaster />
				<Clock unit={temp} weather={weather} />
				<div className="fixed bottom-0 flex h-max w-full justify-center">
					<div className="fixed bottom-0 left-0 flex flex-row">
						<div className="fixed bottom-0 left-0 flex flex-row">
							<Settings
								setSpotify={setSpotify}
								setCountdown={setCountdown}
								setTemp={setTemp}
								setWeather={setWeather}
							/>
						</div>
					</div>
					{spotify && (redirNeeded || !redirNeeded) && <Spotify />}
					{countdown && <Countdown />}
				</div>
			</div>
		</RedirContext.Provider>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
