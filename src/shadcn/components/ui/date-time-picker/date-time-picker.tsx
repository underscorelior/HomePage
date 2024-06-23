'use client';

import { CalendarIcon } from 'lucide-react';
import React, { useRef, useState } from 'react';
import {
	DateValue,
	useButton,
	useDatePicker,
	useInteractOutside,
} from 'react-aria';
import { DatePickerStateOptions, useDatePickerState } from 'react-stately';
import { useForwardedRef } from '@/shadcn/lib/useForwardedRef';
import { cn } from '@/shadcn/lib/utils';
import { Button } from '../button';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { Calendar } from './calendar';
import { DateField } from './date-field';
import { TimeField } from './time-field';

const DateTimePicker = React.forwardRef<
	HTMLDivElement,
	DatePickerStateOptions<DateValue>
>((props, forwardedRef) => {
	const ref = useForwardedRef(forwardedRef);
	const buttonRef = useRef<HTMLButtonElement | null>(null);
	const contentRef = useRef<HTMLDivElement | null>(null);

	const [open, setOpen] = useState(false);

	const state = useDatePickerState(props);
	const {
		groupProps,
		fieldProps,
		buttonProps: _buttonProps,
		dialogProps,
		calendarProps,
	} = useDatePicker(props, state, ref);
	const { buttonProps } = useButton(_buttonProps, buttonRef);
	useInteractOutside({
		ref: contentRef,
		onInteractOutside: () => {
			setOpen(false);
		},
	});

	return (
		<div
			{...groupProps}
			ref={ref}
			className={cn(
				groupProps.className,
				'ring-offset-background focus-within:ring-ring flex items-center rounded-md focus-within:ring-2 focus-within:ring-offset-2',
			)}>
			<DateField {...fieldProps} />
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						{...buttonProps}
						variant="outline"
						className="rounded-l-none"
						disabled={props.isDisabled}
						onClick={() => setOpen(true)}>
						<CalendarIcon className="h-5 w-5" />
					</Button>
				</PopoverTrigger>
				<PopoverContent ref={contentRef} className="w-full">
					<div {...dialogProps} className="space-y-3">
						<Calendar {...calendarProps} />
						{!!state.hasTime && (
							<TimeField
								value={state.timeValue}
								onChange={state.setTimeValue}
							/>
						)}
					</div>
				</PopoverContent>
			</Popover>
		</div>
	);
});

DateTimePicker.displayName = 'DateTimePicker';

export { DateTimePicker };
