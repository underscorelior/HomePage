import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

export function App() {
	return (
		<div className='w-screen h-screen flex flex-col justify-center items-center shadow-xl bg-ctp-crust'>
			<h1 className='font-black text-5xl lg:text-6xl mb-4 bg-gradient-to-r bg-clip-text text-transparent from-ctp-red to-ctp-blue p-6'>
				Homepage
			</h1>
		</div>
	);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
