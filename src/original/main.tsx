import type { FC, Ref } from 'react';

import type { DateRangePickerProps, DateRangePickerComponent, TFocusPosition } from './types';

import { forwardRef, useState } from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DesktopTooltipWrapper, usePickerState, DateInputPropsLike } from '@mui/x-date-pickers/internals';

import { useDateRangeValidation } from './hooks/useDateRangeValidation';

import { Popup } from './panel/popup';
import { DateRangePickerInput } from './panel/input';
import { useDefaultizedProps, dateRangePickerValueManager } from './panel/shared';

function DateRangePickerLogic<TInputDate, TDate = TInputDate>(
  inProps: DateRangePickerProps<TInputDate, TDate>,
  ref: Ref<HTMLDivElement>
) {
  const convetedProps = useThemeProps({ props: inProps, name: 'DateRangePicker' });
  const props = useDefaultizedProps<TInputDate, TDate, DateRangePickerProps<TInputDate, TDate>>(
    convetedProps,
    'DateRangePicker'
  );

  const validationError = useDateRangeValidation(props);
  /**
   * 当前输入的焦点在 `start` 还是在 `end`，默认值为 `start`
   */
  const [focusPosition, setFocusPosition] = useState<TFocusPosition>('start');

  const { pickerProps, inputProps, wrapperProps } = usePickerState(props, dateRangePickerValueManager);

  const { value, onChange, PopperProps, PaperProps, TransitionComponent, ...other } = props;
  const DateInputProps = {
    ...inputProps,
    ...other,
    focusPosition,
    setFocusPosition,
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
      <Popup<TInputDate, TDate>
        open={wrapperProps.open}
        DateInputProps={DateInputProps}
        focusPosition={focusPosition}
        setFocusPosition={setFocusPosition}
        {...pickerProps}
        {...other}
      />
    </DesktopTooltipWrapper>
  );
}

DateRangePickerLogic.displayName = 'DateRangePicker';
export const DateRangePicker = forwardRef(DateRangePickerLogic) as DateRangePickerComponent;
