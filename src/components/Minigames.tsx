import { FaGamepad } from 'react-icons/fa6';

function Minigames() {
	return (
		<div className="fixed bottom-0 left-0 m-4 w-full">
			<button className="bg-ctp-crust ring-ctp-surface0 flex h-14 w-14 items-center justify-center rounded-lg p-4 ring">
				<FaGamepad className="fill-ctp-sky h-10 w-10" size={'4em'} />
			</button>
		</div>
	);
}

export default Minigames;
