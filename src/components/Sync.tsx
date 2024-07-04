import { Button } from '@/shadcn/components/ui/button';
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/shadcn/components/ui/dialog';
import { Textarea } from '@/shadcn/components/ui/textarea';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/shadcn/components/ui/tooltip';
import { handleCreate, handleUpdate, updateData } from '@/utils/sync';
import { useEffect, useState } from 'react';
import { TbCheck, TbClipboard } from 'react-icons/tb';

export function CreateSyncCode() {
	const [code, setCode] = useState<string>('');
	const [copy, setCopy] = useState<boolean>(false);
	const [open, setOpen] = useState<boolean>(false);

	useEffect(() => {
		async function getCode() {
			const code = await handleCreate();
			setCode(code);
			localStorage.setItem('code', code);
			await handleUpdate(code);
		}
		if (open) getCode();
	}, [open]);
	return (
		<Dialog
			open={open}
			onOpenChange={(x) => {
				setOpen(x);
			}}>
			<DialogTrigger>
				<Button>Create New Code</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Your New Sync Code:</DialogTitle>
				</DialogHeader>
				<DialogDescription>
					<Textarea
						className="text-neutral-800 dark:text-neutral-200"
						value={code}
						readOnly
					/>
				</DialogDescription>
				<DialogFooter className="flex w-full flex-row gap-2">
					<p className="text-sm font-medium">
						Make sure to save this! If you lose it, you will lose all of your
						settings.
					</p>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger
								className="flex aspect-square size-auto items-center justify-center rounded-lg border-[1.5px] border-neutral-500 p-2 dark:border-neutral-600"
								onClick={async () => {
									navigator.clipboard.writeText(code);
									setCopy(true);
									await new Promise((r) => setTimeout(r, 2000));
									setCopy(false);
								}}>
								{copy ? (
									<TbCheck className="size-[125%]" />
								) : (
									<TbClipboard className="size-[125%]" />
								)}
							</TooltipTrigger>
							<TooltipContent>
								<p>Click to Copy</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					<DialogClose>
						<Button>Close</Button>
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

export function LoadSyncCode({ updatePage }: { updatePage: () => void }) {
	const [code, setCode] = useState<string>('');

	async function submitCode() {
		await updateData(code);
		localStorage.setItem('code', code);
		updatePage();
	}

	return (
		<Dialog>
			<DialogTrigger>
				<Button variant={'outline'}>Use Existing Code</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px] dark:text-neutral-100">
				<DialogHeader>
					<DialogTitle className="text-xl font-semibold dark:text-neutral-100">
						Enter Your Sync Code:
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col gap-y-2 py-4">
					<Textarea
						placeholder="Input sync code here!"
						onChange={(e) => setCode(e.target.value)}
					/>
				</div>
				<DialogFooter className="flex w-full flex-row gap-2">
					<DialogClose>
						<Button variant="ghost">Cancel</Button>
					</DialogClose>

					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger>
								<Button
									type="submit"
									onClick={async () => {
										submitCode();
									}}>
									Submit
								</Button>
							</TooltipTrigger>
							<TooltipContent>
								<p className="max-w-[20dvh] text-center">
									WARNING! This will override all of your current settings.
								</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
