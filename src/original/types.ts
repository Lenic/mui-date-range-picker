import type { RefAttributes } from 'react';
import type { DesktopWrapperProps } from '@mui/x-date-pickers/internals';

import type { BaseDateRangePickerProps } from './DateRangePicker/shared';

export type DateRangePickerProps<TInputDate, TDate> = BaseDateRangePickerProps<TInputDate, TDate> & DesktopWrapperProps;

export type DateRangePickerComponent = <TInputDate, TDate = TInputDate>(
  props: DateRangePickerProps<TInputDate, TDate> & RefAttributes<HTMLDivElement>
) => JSX.Element;
