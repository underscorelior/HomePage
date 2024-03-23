import { FaGamepad } from 'react-icons/fa6';

function Minigames() {
	return (
		<div className="m-4 ml-2 w-full">
			<button className="flex h-14 w-14 items-center justify-center rounded-lg bg-neutral-900 p-4 ring ring-neutral-700">
				<FaGamepad className="fill-ctp-sky h-10 w-10" size={'4em'} />
			</button>
		</div>
	);
}

export default Minigames;
