import ReactDOM from 'react-dom/client';
import './index.css';
import Clock from './components/Clock';
// import Spotify from './components/Spotify';

export function App() {
	return (
		<div className="bg-ctp-base flex h-screen w-screen flex-col overflow-hidden">
			<header className="flex w-full">
				<h1 className="flex w-full justify-end">
					<Clock />
				</h1>
			</header>
			{/* <main className="absolute top-[45%] flex w-full items-center justify-center">
				<SearchBar />
			</main> */}
			{/* <div className="right-0 top-0 h-full w-full"> <Tasks /> </div>*/}
			{/* <Spotify /> */}
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
