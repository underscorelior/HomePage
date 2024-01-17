import { FaPlus, FaTrashAlt } from 'react-icons/fa';
import { HiColorSwatch } from 'react-icons/hi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Color = keyof typeof colors;
interface Task {
	text: string;
	color: Color;
	id: number;
}

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
};

function TaskCard({
	task,
	removeTask,
}: {
	task: Task;
	removeTask: (task: Task) => void;
}) {
	return (
		<div className="m-3 flex h-12 min-w-0 flex-row items-center justify-between gap-x-2">
			<div className="mx-auto flex size-10 items-center justify-center">
				<span
					className={
						'border-ctp-surface0 h-full w-full rounded-full border-2 p-2'
					}
					style={{ backgroundColor: colors[task.color] }}></span>
			</div>
			<div className="flex h-full w-[65%] flex-row items-center space-x-4">
				<p className="text-ctp-text bg-ctp-mantle border-ctp-surface0 flex h-full w-full items-center overflow-x-auto overflow-y-hidden rounded-lg border-2 px-4 py-2 text-lg font-semibold">
					{task.text}
				</p>
			</div>
			<button
				className="bg-ctp-mantle border-ctp-surface0 h-full w-auto rounded-lg border-2 p-2"
				onClick={() => removeTask(task)}>
				<FaTrashAlt className="fill-ctp-red h-7 w-7" />
			</button>
		</div>
	);
}

export default function Tasks() {
	const [tasks, setTasks] = useState<Task[]>([]);
	const [colorSelectOpen, setColorSelectOpen] = useState<boolean>(false);
	const selectedColor = localStorage.getItem('selectedColor') as Color;

	function createTask(text: string, color: Color) {
		if (!text) {
			toast.error("Can't create empty task!", {
				style: {
					border: '1px solid #313244',
					padding: '16px',
					color: '#cdd6f4',
					backgroundColor: '#181825',
				},
				iconTheme: {
					primary: '#f38ba8',
					secondary: '#1e1e2e',
				},
			});
			return;
		}

		const id = tasks.reduce((acc, task) => Math.max(acc, task.id), 0) + 1;
		const task: Task = { text, color, id };

		sortTasks([...tasks, task]);

		const inputElement = document.getElementById('task') as HTMLInputElement;
		if (inputElement) {
			inputElement.value = '';
		}
	}

	function removeTask(task: Task) {
		sortTasks(tasks.filter((t) => t !== task));
	}

	function saveTasks(tasks: Task[]) {
		localStorage.setItem('tasks', JSON.stringify(tasks));
		setTasks(tasks);
	}

	function setSelectedColor(color: Color) {
		setColorSelectOpen(false);
		localStorage.setItem('selectedColor', color);
	}

	function sortTasks(tasks: Task[]) {
		const sortedTasks = tasks.sort((a, b) => {
			const aColor = Object.keys(colors).indexOf(a.color);
			const bColor = Object.keys(colors).indexOf(b.color);
			return aColor - bColor;
		});
		saveTasks(sortedTasks);
	}

	useEffect(() => {
		const tasks = localStorage.getItem('tasks');
		if (tasks) {
			setTasks(JSON.parse(tasks));
		}
	}, []);

	return (
		<div className="border-ctp-surface0 bg-ctp-crust fixed bottom-0 right-0 hidden h-[2/5] max-h-[calc(3vh*100/5)] min-h-[calc(3vh*100/5)] w-[calc(6vh*100/15)] flex-col justify-between rounded-tl-xl border-l-2 border-t-2 transition-all duration-300 ease-in-out xl:flex">
			<div className="h-[75%] overflow-y-auto">
				{tasks.map((task) => (
					<TaskCard task={task} removeTask={removeTask} />
				))}
			</div>
			<div className="border-ctp-surface0 mx-auto flex h-full w-full flex-row items-center gap-x-2 border-t-2 px-3 py-2">
				<input
					type="text"
					autoComplete="off"
					id="task"
					placeholder="Enter Task"
					className="bg-ctp-mantle border-ctp-surface0 text-ctp-text focus-within:border-ctp-surface2 h-auto w-[80%] rounded-lg border-2 p-3 text-xl font-medium outline-none"
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							createTask(
								(document.getElementById('task') as HTMLInputElement).value,
								selectedColor,
							);
							e.preventDefault();
						}
					}}
				/>
				<div className="relative mx-auto flex items-center justify-center">
					<button
						className="bg-ctp-mantle border-ctp-surface0 mx-auto flex h-auto flex-col-reverse items-center justify-center rounded-lg border-2 p-3 outline-none"
						onClick={() => {
							setColorSelectOpen(!colorSelectOpen);
						}}>
						<HiColorSwatch
							className="h-7 w-7"
							style={{ color: colors[selectedColor] }}
						/>
					</button>
					{colorSelectOpen && (
						<div className="absolute top-0 -mt-[9rem] flex w-[150%] items-center justify-center outline-none">
							<div className="bg-ctp-crust border-ctp-surface0 grid h-max grid-cols-3 items-center justify-center gap-1 rounded-lg border-2 p-2">
								{Object.keys(colors).map((color) => (
									<button
										key={color}
										className="bg-ctp-mantle border-ctp-surface0 h-4 w-4 rounded-full border-[2px] p-2"
										style={{ backgroundColor: colors[color as Color] }}
										onClick={() => setSelectedColor(color as Color)}></button>
								))}
							</div>
						</div>
					)}
				</div>
				<button
					className="bg-ctp-mantle border-ctp-surface0 mx-auto flex h-auto items-center justify-center rounded-lg border-2 p-3"
					onClick={() =>
						createTask(
							(document.getElementById('task') as HTMLInputElement).value,
							selectedColor,
						)
					}>
					<FaPlus className="fill-ctp-green h-7 w-7" />
				</button>
			</div>
		</div>
	);
}
