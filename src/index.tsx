import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Clock from './components/Clock';

export function App() {
	return (
		<div className='w-screen h-screen flex flex-col shadow-xl bg-ctp-crust'>
			<header className='w-full flex'>
				<h1 className='w-full flex justify-end'>
					<Clock />
				</h1>
			</header>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
