import { FaSearch } from 'react-icons/fa';

function SearchBar() {
	return (
		<form
			action="https://www.google.com/search"
			method="get"
			className="flex h-12 w-full items-center justify-center gap-x-4 text-2xl">
			<input
				type="text"
				name="q"
				className="h-full w-2/5 rounded-lg bg-ctp-crust px-3 text-ctp-text outline-none ring-2 ring-ctp-surface0 focus:outline-ctp-surface2 active:outline-ctp-surface2"
			/>
			<button
				type="submit"
				className="flex aspect-square h-full w-auto items-center justify-center rounded-lg bg-ctp-mantle font-black text-ctp-sky ring-2 ring-ctp-surface0">
				<FaSearch />
			</button>
		</form>
	);
}

export default SearchBar;
