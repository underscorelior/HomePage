'use client';

import { DateSegment } from './date-segment';
import { createCalendar } from '@internationalized/date';
import { useRef } from 'react';
import {
	AriaDatePickerProps,
	DateValue,
	useDateField,
	useLocale,
} from 'react-aria';
import { useDateFieldState } from 'react-stately';
import { cn } from '@/shadcn/lib/utils';

function DateField(props: AriaDatePickerProps<DateValue>) {
	const ref = useRef<HTMLDivElement | null>(null);

	const { locale } = useLocale();
	const state = useDateFieldState({
		...props,
		locale,
		createCalendar,
	});
	const { fieldProps } = useDateField(props, state, ref);

	return (
		<div
			{...fieldProps}
			ref={ref}
			aria-label="date field"
			className={cn(
				'border-input ring-offset-background focus-visible:ring-ring inline-flex h-10 flex-1 items-center rounded-l-md border border-r-0 bg-transparent py-2 pl-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:border-neutral-800',
				props.isDisabled ? 'cursor-not-allowed opacity-50' : '',
			)}>
			{state.segments.map((segment, i) => (
				<DateSegment key={i} segment={segment} state={state} />
			))}
			{state.validationState === 'invalid' && (
				<span aria-hidden="true">🚫</span>
			)}
		</div>
	);
}

export { DateField };
