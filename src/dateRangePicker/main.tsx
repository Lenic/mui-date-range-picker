import type { FC, Ref } from 'react';

import type { TDateRangePickerProps, TDateRangePickerComponent, TFocusPosition } from './types';

import { forwardRef, useMemo, useState } from 'react';
import { useThemeProps } from '@mui/material/styles';
import { DesktopTooltipWrapper, usePickerState, DateInputPropsLike } from '@mui/x-date-pickers/internals';

import { Popup } from './panel/popup';
import { DateRangePickerInput } from './panel/input';
import { dateRangePickerValueManager } from './utils';
import { useDateRangeValidation, useDefaultizedProps } from './hooks';

function DateRangePickerLogic<TInputDate, TDate = TInputDate>(
  inProps: TDateRangePickerProps<TInputDate, TDate>,
  ref: Ref<HTMLDivElement>
) {
  const convetedProps = useThemeProps({ props: inProps, name: 'DateRangePicker' });
  const props = useDefaultizedProps<TInputDate, TDate, TDateRangePickerProps<TInputDate, TDate>>(
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
  const DateInputProps = useMemo(
    () => ({ ...inputProps, ...other, focusPosition, setFocusPosition, validationError, ref }),
    [inputProps, other, focusPosition, setFocusPosition, validationError, ref]
  );

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
export const DateRangePicker = forwardRef(DateRangePickerLogic) as TDateRangePickerComponent;
