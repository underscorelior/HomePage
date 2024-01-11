import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import Bars from '../assets/bars.svg';
import { HiColorSwatch } from 'react-icons/hi';

type Color = keyof typeof colors;

const colors = {
	rosewater: '#f5e0dc',
	flamingo: '#f2cdcd',
	pink: '#f5c2e7',
	mauve: '#cba6f7',
	red: '#f38ba8',
	maroon: '#eba0ac',
	peach: '#fab387',
	yellow: '#f9e2af',
	green: '#a6e3a1',
	teal: '#94e2d5',
	sky: '#89dceb',
	sapphire: '#74c7ec',
	blue: '#89b4fa',
	lavender: '#b4befe',
	text: '#cdd6f4',
	subtext1: '#bac2de',
	subtext0: '#a6adc8',
	overlay2: '#9399b2',
	overlay1: '#7f849c',
	overlay0: '#6c7086',
	surface2: '#585b70',
	surface1: '#45475a',
	surface0: '#313244',
	base: '#1e1e2e',
	mantle: '#181825',
	crust: '#11111b',
};

function TaskCard({ text, color }: { text: string; color: Color }) {
	return (
		<div className="m-4 flex h-12 flex-row items-center justify-between space-x-2">
			<div className="flex h-full w-3/4 flex-row items-center space-x-4">
				<img src={Bars} className="" />
				<p className="text-ctp-text bg-ctp-mantle border-ctp-surface0 flex h-full w-full items-center rounded-lg border-2 px-4 py-2 text-lg font-semibold">
					{text}
				</p>
			</div>
			<div className="flex flex-row items-center space-x-2">
				<button className="bg-ctp-mantle border-ctp-surface0 h-full w-auto rounded-lg border-2 p-2">
					<FaTrashAlt className="fill-ctp-red h-7 w-7" />
				</button>
				<span
					className={
						'border-ctp-surface0 h-12 w-12 rounded-full border-[3px] p-2'
					}
					style={{ backgroundColor: colors[color] }}></span>
			</div>
		</div>
	);
}

export default function Tasks() {
	return (
		<div className="border-ctp-surface0 bg-ctp-crust fixed bottom-0 right-0 flex h-3/5 w-[calc(7vh*100/15)] flex-col justify-between rounded-tl-xl border-l-2 border-t-2">
			<div>
				<TaskCard text="APPC - IP1" color="lavender" />
				<TaskCard text="APPC - IP2" color="sky" />
				<TaskCard text="APPC - IP3" color="green" />
			</div>
			<div>
				<form>
					<input type="text" id="task" placeholder="Enter Task" />
					<button type="submit">
						<FaPlus />
					</button>
				</form>
				<HiColorSwatch />
			</div>
		</div>
	);
}
