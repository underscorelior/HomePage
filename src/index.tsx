import ReactDOM from 'react-dom/client';
import './index.css';
import Clock from './components/Clock';
import Spotify from './components/Spotify';
import { Toaster } from 'react-hot-toast';
import Minigames from './components/Minigames';

export function App() {
	return (
		<div className="bg-ctp-base flex h-screen w-screen flex-col overflow-hidden">
			<Toaster />
			<Clock />
			<div className="fixed bottom-0 flex h-max w-full justify-center">
				<Minigames />
				<Spotify />
			</div>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
