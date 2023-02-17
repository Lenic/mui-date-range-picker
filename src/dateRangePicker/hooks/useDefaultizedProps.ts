import type { BaseDateValidationProps, DefaultizedProps } from '@mui/x-date-pickers/internals';

import type { BaseDateRangePickerProps } from '../types';

import { useMemo } from 'react';
import { useThemeProps } from '@mui/material/styles';
import { useDefaultDates, useLocaleText, useUtils, parseNonNullablePickerDate } from '@mui/x-date-pickers/internals';

export function useDefaultizedProps<TInputDate, TDate, Props extends BaseDateRangePickerProps<TInputDate, TDate>>(
  props: Props,
  name: string
): DefaultizedProps<Props, keyof BaseDateValidationProps<TDate>, { inputFormat: string }> {
  // This is technically unsound if the type parameters appear in optional props.
  // Optional props can be filled by `useThemeProps` with types that don't match the type parameters.
  const themeProps = useThemeProps({ props, name });
  const { minDate: tmin, maxDate: tmax } = themeProps;

  const utils = useUtils<TDate>();
  const { end, start } = useLocaleText();
  const { minDate, maxDate } = useDefaultDates<TDate>();
  return useMemo(
    () => ({
      disableFuture: false,
      disablePast: false,
      inputFormat: utils.formats.keyboardDate,
      ...themeProps,
      endText: end,
      startText: start,
      minDate: parseNonNullablePickerDate(utils, tmin, minDate),
      maxDate: parseNonNullablePickerDate(utils, tmax, maxDate),
    }),
    [end, maxDate, minDate, start, themeProps, tmax, tmin, utils]
  );
}
