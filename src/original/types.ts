import type { RefAttributes } from 'react';
import type { DesktopWrapperProps } from '@mui/x-date-pickers/internals';

import type { BaseDateRangePickerProps } from './DateRangePicker/shared';

export type DateRangePickerProps<TInputDate, TDate> = BaseDateRangePickerProps<TInputDate, TDate> & DesktopWrapperProps;

export type DateRangePickerComponent = <TInputDate, TDate = TInputDate>(
  props: DateRangePickerProps<TInputDate, TDate> & RefAttributes<HTMLDivElement>
) => JSX.Element;

/**
 * 当前输入的焦点在哪个位置
 *
 * - 两个日期输入框中前面的位置，值为 `start`
 * - 两个日期输入框中后面的位置，值为 `end`
 */
export type TFocusPosition = 'start' | 'end';
