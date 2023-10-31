import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Clock from './components/Clock';
import SearchBar from './components/SearchBar';

export function App() {
	return (
		<div className='w-screen h-screen flex flex-col bg-ctp-base'>
			<header className='w-full flex'>
				<h1 className='w-full flex justify-end'>
					<Clock />
				</h1>
			</header>
			<main className='w-full items-center justify-center flex'>
				<SearchBar />
			</main>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
