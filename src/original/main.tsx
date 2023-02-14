import type { FC, Ref } from 'react';

import { forwardRef, useState } from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DesktopTooltipWrapper, usePickerState, DateInputPropsLike } from '@mui/x-date-pickers/internals';

import { useDateRangeValidation } from '../dateRangerPicker/internal/hooks/validation/useDateRangeValidation';

import { DateRangePickerView } from './DateRangePicker/DateRangePickerView';
import { DateRangePickerInput } from './DateRangePicker/DateRangePickerInput';
import { useDateRangePickerDefaultizedProps, dateRangePickerValueManager } from './DateRangePicker/shared';

import type { DateRangePickerProps, DateRangePickerComponent } from './types';

function DateRangePickerLogic<TInputDate, TDate = TInputDate>(
  inProps: DateRangePickerProps<TInputDate, TDate>,
  ref: Ref<HTMLDivElement>
) {
  const convetedProps = useThemeProps({ props: inProps, name: 'DateRangePicker' });
  const props = useDateRangePickerDefaultizedProps<TInputDate, TDate, DateRangePickerProps<TInputDate, TDate>>(
    convetedProps,
    'DateRangePicker'
  );

  const validationError = useDateRangeValidation(props);
  const [currentlySelectingRangeEnd, setCurrentlySelectingRangeEnd] = useState<'start' | 'end'>('start');

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
      KeyboardDateInputComponent={DateRangePickerInput as unknown as FC<DateInputPropsLike>}
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
export const DateRangePicker = forwardRef(DateRangePickerLogic) as DateRangePickerComponent;