import ReactDOM from 'react-dom/client';
import './index.css';
import Clock from './components/Clock';
import Spotify from './components/Spotify';
import { Toaster } from 'react-hot-toast';
import Countdown from './components/Countdown';
import Settings from './components/Settings';
import { useState } from 'react';

export function App() {
	const [spotify, setSpotify] = useState<boolean>(false);
	const [countdown, setCountdown] = useState<boolean>(false);
	const [weather, setWeather] = useState<boolean>(false);
	const [temp, setTemp] = useState<string>(localStorage.getItem('temp') || 'c');

	return (
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
				{spotify && <Spotify />}
				{countdown && <Countdown />}
			</div>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
