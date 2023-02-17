import type { KeyboardEvent, MouseEvent, ReactElement, Ref, RefAttributes } from 'react';

import { forwardRef, useCallback, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  useUtils,
  useLocaleText,
  executeInTheNextEventLoopTick,
  DateInputProps,
  ExportedDateInputProps,
  MuiTextFieldProps,
  useMaskedInput,
  onSpaceOrEnter,
} from '@mui/x-date-pickers/internals';
import { CurrentlySelectingRangeEndProps, DateRange } from '../internal/models/dateRange';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';

const DateRangePickerInputRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'baseline',
  [theme.breakpoints.down('xs')]: {
    flexDirection: 'column',
    alignItems: 'center',
  },
}));

export interface ExportedDateRangePickerInputProps<TInputDate, TDate>
  extends Omit<ExportedDateInputProps<TInputDate, TDate>, 'renderInput'> {
  /**
   * The `renderInput` prop allows you to customize the rendered input.
   * The `startProps` and `endProps` arguments of this render prop contains props of [TextField](https://mui.com/material-ui/api/text-field/#props),
   * that you need to forward to the range start/end inputs respectively.
   * Pay specific attention to the `ref` and `inputProps` keys.
   * @example
   * ```jsx
   * <DateRangePicker
   *  renderInput={(startProps, endProps) => (
   *   <React.Fragment>
   *     <TextField {...startProps} />
   *     <Box sx={{ mx: 2 }}> to </Box>
   *     <TextField {...endProps} />
   *   </React.Fragment>;
   *  )}
   * />
   * ````
   * @param {MuiTextFieldProps} startProps Props that you need to forward to the range start input.
   * @param {MuiTextFieldProps} endProps Props that you need to forward to the range end input.
   * @returns {React.ReactElement} The range input to render.
   */
  renderInput: (startProps: MuiTextFieldProps, endProps: MuiTextFieldProps) => ReactElement;
  onChange: (date: DateRange<TDate>, keyboardInputValue?: string) => void;
}

export interface InputProps<TInputDate, TDate>
  extends ExportedDateRangePickerInputProps<TInputDate, TDate>,
    Omit<
      DateInputProps<TInputDate, TDate>,
      keyof ExportedDateRangePickerInputProps<TInputDate, TDate> | 'rawValue' | 'validationError'
    >,
    CurrentlySelectingRangeEndProps {
  validationError: DateRangeValidationError;
  rawValue: DateRange<TInputDate>;
  mobile?: boolean;
}

type DatePickerInput = <TInputDate, TDate>(
  props: InputProps<TInputDate, TDate> & RefAttributes<HTMLDivElement>
) => JSX.Element;

function DateRangePickerInputLogic<TInputDate, TDate>(
  inProps: InputProps<TInputDate, TDate>,
  ref: Ref<HTMLDivElement>
) {
  const props = useThemeProps({ props: inProps, name: 'DateRangePickerInput' });
  const {
    currentlySelectingRangeEnd,
    disableOpenPicker,
    onBlur,
    onChange,
    open,
    openPicker,
    rawValue,
    rawValue: [start, end],
    readOnly,
    renderInput,
    setCurrentlySelectingRangeEnd,
    TextFieldProps,
    validationError: [startValidationError, endValidationError],
    className,
    mobile,
    ...other
  } = props;

  const utils = useUtils<TDate>();
  const startRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    if (currentlySelectingRangeEnd === 'start') {
      startRef.current?.focus();
    } else if (currentlySelectingRangeEnd === 'end') {
      endRef.current?.focus();
    }
  }, [currentlySelectingRangeEnd, open]);

  // TODO: rethink this approach. We do not need to wait for calendar to be updated to rerender input (looks like freezing)
  // TODO: so simply break 1 react's commit phase in 2 (first for input and second for calendars) by executing onChange in the next tick
  const lazyHandleChangeCallback = useCallback(
    (...args: Parameters<typeof onChange>) => executeInTheNextEventLoopTick(() => onChange(...args)),
    [onChange]
  );

  const handleStartChange = (date: TDate | null, inputString?: string) => {
    lazyHandleChangeCallback([date, utils.date(end)], inputString);
  };

  const handleEndChange = (date: TDate | null, inputString?: string) => {
    lazyHandleChangeCallback([utils.date(start), date], inputString);
  };

  const openRangeStartSelection = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();
    if (setCurrentlySelectingRangeEnd) {
      setCurrentlySelectingRangeEnd('start');
    }
    if (!readOnly && !disableOpenPicker) {
      openPicker();
    }
  };

  const openRangeEndSelection = (event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    event.stopPropagation();
    if (setCurrentlySelectingRangeEnd) {
      setCurrentlySelectingRangeEnd('end');
    }
    if (!readOnly && !disableOpenPicker) {
      openPicker();
    }
  };

  const focusOnRangeEnd = () => {
    if (open && setCurrentlySelectingRangeEnd) {
      setCurrentlySelectingRangeEnd('end');
    }
  };

  const focusOnRangeStart = () => {
    if (open && setCurrentlySelectingRangeEnd) {
      setCurrentlySelectingRangeEnd('start');
    }
  };

  const localeText = useLocaleText();
  const startInputProps = useMaskedInput({
    ...other,
    readOnly,
    rawValue: start,
    onChange: handleStartChange,
    label: localeText.start,
    validationError: startValidationError !== null,
    TextFieldProps: {
      ...TextFieldProps,
      ref: startRef,
      focused: open ? currentlySelectingRangeEnd === 'start' : undefined,
      // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
      // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
      ...(!readOnly && !other.disabled && { onClick: openRangeStartSelection }),
    },
    inputProps: {
      onClick: openRangeStartSelection,
      onKeyDown: onSpaceOrEnter(openRangeStartSelection),
      onFocus: focusOnRangeStart,
      readOnly: mobile,
    },
  });

  const endInputProps = useMaskedInput({
    ...other,
    readOnly,
    label: localeText.end,
    rawValue: end,
    onChange: handleEndChange,
    validationError: endValidationError !== null,
    TextFieldProps: {
      ...TextFieldProps,
      ref: endRef,
      focused: open ? currentlySelectingRangeEnd === 'end' : undefined,
      // registering `onClick` listener on the root element as well to correctly handle cases where user is clicking on `label`
      // which has `pointer-events: none` and due to DOM structure the `input` does not catch the click event
      ...(!readOnly && !other.disabled && { onClick: openRangeEndSelection }),
    },
    inputProps: {
      onClick: openRangeEndSelection,
      onKeyDown: onSpaceOrEnter(openRangeEndSelection),
      onFocus: focusOnRangeEnd,
      readOnly: mobile,
    },
  });

  return (
    <DateRangePickerInputRoot onBlur={onBlur} ref={ref} className={clsx('input-container', className)}>
      {renderInput(startInputProps, endInputProps)}
    </DateRangePickerInputRoot>
  );
}

/**
 * @ignore - internal component.
 */
export const DateRangePickerInput = forwardRef(DateRangePickerInputLogic) as DatePickerInput;
