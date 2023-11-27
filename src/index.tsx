import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Clock from './components/Clock';
import SearchBar from './components/SearchBar';
// import Tasks from './components/Task';
// import Schoology from './components/Schoology';

export function App() {
	return (
		<div className="bg-ctp-base flex h-screen w-screen flex-col overflow-hidden">
			<header className="flex w-full">
				<h1 className="flex w-full justify-end">
					<Clock />
				</h1>
			</header>
			<main className="absolute top-[45%] flex w-full items-center justify-center">
				<SearchBar />
			</main>
			<div className="right-0 top-0 h-full w-full">{/* <Tasks /> */}</div>
			{/* <Schoology /> */}
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
