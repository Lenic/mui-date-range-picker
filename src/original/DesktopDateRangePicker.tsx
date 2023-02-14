import type { FC, Ref, RefAttributes } from 'react';

import { forwardRef, useState } from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  DesktopTooltipWrapper,
  usePickerState,
  DateInputPropsLike,
  DesktopWrapperProps,
} from '@mui/x-date-pickers/internals';
import { DateRangePickerView } from './DateRangePicker/DateRangePickerView';
import { DateRangePickerInput } from './DateRangePicker/DateRangePickerInput';
import { useDateRangeValidation } from './../dateRangerPicker/internal/hooks/validation/useDateRangeValidation';
import {
  BaseDateRangePickerProps,
  useDateRangePickerDefaultizedProps,
  dateRangePickerValueManager,
} from './DateRangePicker/shared';

const KeyboardDateInputComponent = DateRangePickerInput as unknown as FC<DateInputPropsLike>;

export type DateRangePickerProps<TInputDate, TDate> = BaseDateRangePickerProps<TInputDate, TDate> & DesktopWrapperProps;

export type DesktopDateRangePickerComponent = <TInputDate, TDate = TInputDate>(
  props: DateRangePickerProps<TInputDate, TDate> & RefAttributes<HTMLDivElement>
) => JSX.Element;

function DateRangePickerLogic<TInputDate, TDate = TInputDate>(
  inProps: DateRangePickerProps<TInputDate, TDate>,
  ref: Ref<HTMLDivElement>
) {
  const convetedProps = useThemeProps({ props: inProps, name: 'MuiDateRangePicker' });
  const props = useDateRangePickerDefaultizedProps<TInputDate, TDate, DateRangePickerProps<TInputDate, TDate>>(
    convetedProps,
    'DateRangePicker'
  );

  const [currentlySelectingRangeEnd, setCurrentlySelectingRangeEnd] = useState<'start' | 'end'>('start');

  const validationError = useDateRangeValidation(props);

  const { pickerProps, inputProps, wrapperProps } = usePickerState(props, dateRangePickerValueManager);

  const { value, onChange, PopperProps, PaperProps, TransitionComponent, ...other } = props;
  const DateInputProps = {
    ...inputProps,
    ...other,
    currentlySelectingRangeEnd,
    setCurrentlySelectingRangeEnd,
    validationError,
    ref,
  };

  return (
    <DesktopTooltipWrapper
      {...wrapperProps}
      DateInputProps={DateInputProps}
      KeyboardDateInputComponent={KeyboardDateInputComponent}
      PopperProps={PopperProps}
      PaperProps={PaperProps}
      TransitionComponent={TransitionComponent}
    >
      <DateRangePickerView<TInputDate, TDate>
        open={wrapperProps.open}
        DateInputProps={DateInputProps}
        currentlySelectingRangeEnd={currentlySelectingRangeEnd}
        setCurrentlySelectingRangeEnd={setCurrentlySelectingRangeEnd}
        {...pickerProps}
        {...other}
      />
    </DesktopTooltipWrapper>
  );
}

DateRangePickerLogic.displayName = 'DateRangePicker';
export const DateRangePicker = forwardRef(DateRangePickerLogic) as DesktopDateRangePickerComponent;
