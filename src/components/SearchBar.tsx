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
				className="bg-ctp-crust text-ctp-text ring-ctp-surface0 focus:outline-ctp-surface2 active:outline-ctp-surface2 h-full w-2/5 rounded-lg px-3 outline-none ring-2"
			/>
			<button
				type="submit"
				className="bg-ctp-mantle text-ctp-sky ring-ctp-surface0 flex aspect-square h-full w-auto items-center justify-center rounded-lg font-black ring-2">
				<FaSearch />
			</button>
		</form>
	);
}

export default SearchBar;
