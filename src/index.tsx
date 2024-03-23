import ReactDOM from 'react-dom/client';
import './index.css';
import Clock from './components/Clock';
import Spotify from './components/Spotify';
import { Toaster } from 'react-hot-toast';
// import Tasks from './components/Tasks';
// import Settings from './components/Settings';
// import Minigames from './components/Minigames';
// import { useState } from 'react';

export function App() {
	// const [spotify, setSpotify] = useState<boolean>(false);
	// const [tasks, setTasks] = useState<boolean>(false);
	// const [minigames, setMinigames] = useState<boolean>(false);
	// const [settingsOpen, setSettingsOpen] = useState<boolean>(true);

	return (
		<div className="flex h-screen w-screen flex-col overflow-hidden bg-neutral-950">
			<Toaster />
			<Clock />
			<div className="fixed bottom-0 flex h-max w-full justify-center">
				{/* <div className="fixed bottom-0 left-0 flex flex-row">
					<Settings
						setSpotify={setSpotify}
						setTasks={setTasks}
						setMinigames={setMinigames}
						setSettingsOpen={setSettingsOpen}
						settingsOpen={settingsOpen}
					/>
					{minigames && <Minigames />}
				</div> */}
				<Spotify />
				{/* {tasks && <Tasks />} */}
			</div>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
