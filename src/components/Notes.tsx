import { Textarea } from '@/shadcn/components/ui/textarea';

export default function Notes() {
	return (
		<div className="flex min-h-[30%] max-w-[50%] flex-col rounded-bl-lg rounded-tl-lg border-y-2 border-l-2 border-neutral-800 bg-neutral-50 p-4 text-xl font-bold sm:fixed sm:right-0 sm:max-w-[20%] dark:border-neutral-800 dark:bg-neutral-950">
			<Textarea className="my-auto h-full" />
		</div>
	);
}
