import ReactDOM from 'react-dom/client';
import './index.css';
import Clock from './components/Clock';
import Spotify from './components/Spotify';
import { Toaster } from 'react-hot-toast';
import Tasks from './components/Tasks';

export function App() {
	return (
		<div className="bg-ctp-base flex h-screen w-screen flex-col overflow-hidden">
			<Toaster />
			<header className="flex w-full">
				<h1 className="flex w-full justify-end">
					<Clock />
				</h1>
			</header>
			{/* <main className="absolute top-[45%] flex w-full items-center justify-center">
				<SearchBar />
			</main> */}
			<div className="fixed bottom-0 flex h-max w-full justify-center">
				<Tasks />
				<Spotify />
			</div>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
