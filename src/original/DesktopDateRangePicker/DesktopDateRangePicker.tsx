import * as React from 'react';
import { useThemeProps } from '@mui/material/styles';
import {
  DesktopTooltipWrapper,
  usePickerState,
  DateInputPropsLike,
  DesktopWrapperProps,
} from '@mui/x-date-pickers/internals';
import { DateRangePickerView } from '../DateRangePicker/DateRangePickerView';
import { DateRangePickerInput } from '../DateRangePicker/DateRangePickerInput';
import { useDateRangeValidation } from '../../dateRangerPicker/internal/hooks/validation/useDateRangeValidation';
import {
  BaseDateRangePickerProps,
  useDateRangePickerDefaultizedProps,
  dateRangePickerValueManager,
} from '../DateRangePicker/shared';

const KeyboardDateInputComponent = DateRangePickerInput as unknown as React.FC<DateInputPropsLike>;

export type DesktopDateRangePickerProps<TInputDate, TDate> = BaseDateRangePickerProps<TInputDate, TDate> &
  DesktopWrapperProps;

export type DesktopDateRangePickerComponent = <TInputDate, TDate = TInputDate>(
  props: DesktopDateRangePickerProps<TInputDate, TDate> & React.RefAttributes<HTMLDivElement>
) => JSX.Element;

/**
 *
 * Demos:
 *
 * - [Date Range Picker](https://mui.com/x/react-date-pickers/date-range-picker/)
 *
 * API:
 *
 * - [DesktopDateRangePicker API](https://mui.com/x/api/date-pickers/desktop-date-range-picker/)
 */
export const DesktopDateRangePicker = React.forwardRef(function DesktopDateRangePicker<TInputDate, TDate = TInputDate>(
  inProps: DesktopDateRangePickerProps<TInputDate, TDate>,
  ref: React.Ref<HTMLDivElement>
) {
  const convetedProps = useThemeProps({ props: inProps, name: 'MuiDateRangePicker' });
  const props = useDateRangePickerDefaultizedProps<TInputDate, TDate, DesktopDateRangePickerProps<TInputDate, TDate>>(
    convetedProps,
    'MuiDesktopDateRangePicker'
  );

  const [currentlySelectingRangeEnd, setCurrentlySelectingRangeEnd] = React.useState<'start' | 'end'>('start');

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
}) as DesktopDateRangePickerComponent;
