import {
  BasePickerProps,
  PickerStateValueManager,
  useDefaultDates,
  useLocaleText,
  useUtils,
  ValidationProps,
  DefaultizedProps,
  parseNonNullablePickerDate,
  BaseDateValidationProps,
} from '@mui/x-date-pickers/internals';
import { useThemeProps } from '@mui/material/styles';
import { CalendarProps } from './popup';
import { DateRangeValidationError } from '../internal/hooks/validation/useDateRangeValidation';
import { DateRange } from '../internal/models';
import { parseRangeInputValue } from '../internal/utils/date-utils';
import { ExportedDateRangePickerInputProps } from './input';

export interface BaseDateRangePickerProps<TInputDate, TDate>
  extends Omit<BasePickerProps<DateRange<TInputDate>, DateRange<TDate>>, 'orientation'>,
    CalendarProps<TDate>,
    BaseDateValidationProps<TDate>,
    ValidationProps<DateRangeValidationError, DateRange<TInputDate>>,
    ExportedDateRangePickerInputProps<TInputDate, TDate> {
  /**
   * Custom mask. Can be used to override generate from format. (e.g. `__/__/____ __:__` or `__/__/____ __:__ _M`).
   * @default '__/__/____'
   */
  mask?: ExportedDateRangePickerInputProps<TInputDate, TDate>['mask'];
  /**
   * Callback fired when the value (the selected date range) changes @DateIOType.
   * @template TDate
   * @param {DateRange<TDate>} date The new parsed date range.
   * @param {string} keyboardInputValue The current value of the keyboard input.
   */
  onChange: (date: DateRange<TDate>, keyboardInputValue?: string) => void;
}

export function useDateRangePickerDefaultizedProps<
  TInputDate,
  TDate,
  Props extends BaseDateRangePickerProps<TInputDate, TDate>
>(props: Props, name: string): DefaultizedProps<Props, keyof BaseDateValidationProps<TDate>, { inputFormat: string }> {
  const utils = useUtils<TDate>();
  const defaultDates = useDefaultDates<TDate>();

  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({
    props,
    name,
  });

  const localeText = useLocaleText();
  return {
    disableFuture: false,
    disablePast: false,
    inputFormat: utils.formats.keyboardDate,
    ...themeProps,
    endText: localeText.end,
    startText: localeText.start,
    minDate: parseNonNullablePickerDate(utils, themeProps.minDate, defaultDates.minDate),
    maxDate: parseNonNullablePickerDate(utils, themeProps.maxDate, defaultDates.maxDate),
  };
}

export const dateRangePickerValueManager: PickerStateValueManager<[any, any], [any, any], any> = {
  emptyValue: [null, null],
  getTodayValue: (utils) => [utils.date()!, utils.date()!],
  parseInput: parseRangeInputValue,
  areValuesEqual: (utils, a, b) => utils.isEqual(a[0], b[0]) && utils.isEqual(a[1], b[1]),
};
