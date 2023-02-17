import type { RefAttributes } from 'react';
import type { DesktopWrapperProps } from '@mui/x-date-pickers/internals';

import type { BaseDateRangePickerProps } from './DateRangePicker/shared';

export type DateRangePickerProps<TInputDate, TDate> = Omit<
  BaseDateRangePickerProps<TInputDate, TDate>,
  'endText' | 'startText'
> &
  DesktopWrapperProps;

export type DateRangePickerComponent = <TInputDate, TDate = TInputDate>(
  props: DateRangePickerProps<TInputDate, TDate> & RefAttributes<HTMLDivElement>
) => JSX.Element;
