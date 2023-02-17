import type { BaseDateRangePickerProps } from '../types';
import {
  PickerStateValueManager,
  useDefaultDates,
  useLocaleText,
  useUtils,
  DefaultizedProps,
  parseNonNullablePickerDate,
  BaseDateValidationProps,
} from '@mui/x-date-pickers/internals';
import { useThemeProps } from '@mui/material/styles';

import { parseRangeInputValue } from '../internal/utils/date-utils';

export function useDefaultizedProps<TInputDate, TDate, Props extends BaseDateRangePickerProps<TInputDate, TDate>>(
  props: Props,
  name: string
): DefaultizedProps<Props, keyof BaseDateValidationProps<TDate>, { inputFormat: string }> {
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
