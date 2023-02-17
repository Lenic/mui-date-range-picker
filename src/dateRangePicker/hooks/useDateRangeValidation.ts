import type { BaseDateValidationProps, ValidationProps, Validator } from '@mui/x-date-pickers/internals';

import type { DateRange, IDayValidation, TFocusPosition, ValidationError, TValidationErrors } from '../types';

import { useValidation, validateDate } from '@mui/x-date-pickers/internals';

import { isRangeValid, parseValue } from '../utils';

export type TValidationProps<TInputDate, TDate> = IDayValidation<TDate> &
  Required<BaseDateValidationProps<TDate>> &
  ValidationProps<TValidationErrors, DateRange<TInputDate>>;

export const validateDateRange: Validator<any, TValidationProps<any, any>> = ({ props, value, adapter }) => {
  const [start, end] = value;

  let ans: [ValidationError, ValidationError] = [null, null];
  if (start === null || end === null) return ans;

  const { shouldDisableDate, ...otherProps } = props;
  const shouldDisable = (position: TFocusPosition) => (day: any) => !!shouldDisableDate?.(day, position);
  ans = [
    validateDate({
      adapter,
      value: start,
      props: {
        ...otherProps,
        shouldDisableDate: shouldDisable('start'),
      },
    }),
    validateDate({
      adapter,
      value: end,
      props: {
        ...otherProps,
        shouldDisableDate: shouldDisable('end'),
      },
    }),
  ];

  if (ans[0] || ans[1]) return ans;

  if (!isRangeValid(adapter.utils, parseValue(adapter.utils, value))) {
    return ['invalidRange', 'invalidRange'];
  }
  return [null, null];
};

export function isSameError(a: TValidationErrors, b: TValidationErrors | null) {
  return b !== null && a[1] === b[1] && a[0] === b[0];
}

export function useDateRangeValidation<TInputDate, TDate>(props: TValidationProps<TInputDate, TDate>) {
  return useValidation(props, validateDateRange, isSameError) as TValidationErrors;
}
