import { FaSearch } from 'react-icons/fa';

function SearchBar() {
	return (
		<form
			action='https://www.google.com/search'
			method='get'
			className='flex w-full items-center justify-center gap-x-4 text-2xl h-12'
		>
			<input
				type='text'
				name='q'
				className='px-3 rounded-xl w-2/5 bg-ctp-crust ring-ctp-surface0 ring-2 text-ctp-text h-full outline-none focus:outline-ctp-surface2 active:outline-ctp-surface2'
			/>
			<button
				type='submit'
				className='font-black text-ctp-sky bg-ctp-mantle rounded-xl ring-ctp-surface0 ring-2 h-full w-auto aspect-square items-center flex justify-center'
			>
				<FaSearch />
			</button>
		</form>
	);
}

export default SearchBar;
