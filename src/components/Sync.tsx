import { Button } from '@/shadcn/components/ui/button';
import {
	DialogContent,
	Dialog,
	DialogTrigger,
} from '@/shadcn/components/ui/dialog';

export function CreateSyncCode() {
	return (
		<Dialog>
			<DialogTrigger>
				<Button>Create New Code</Button>
			</DialogTrigger>
			<DialogContent></DialogContent>
		</Dialog>
	);
}

export function LoadSyncCode() {
	return (
		<Dialog>
			<DialogTrigger>
				<Button variant={'outline'}>Use Existing Code</Button>
			</DialogTrigger>
			<DialogContent></DialogContent>
		</Dialog>
	);
}
