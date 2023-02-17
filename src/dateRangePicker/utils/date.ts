import type { MuiPickersAdapter, PickerStateValueManager } from '@mui/x-date-pickers/internals';

import type { DateRange, NonEmptyDateRange } from '../types';

export const parseValue = <TDate>(utils: MuiPickersAdapter<TDate>, value: DateRange<TDate> = [null, null]) =>
  value.map((date) => {
    if (date === null || !utils.isValid(date)) {
      return null;
    }

    return utils.startOfDay(utils.date(date) as TDate);
  }) as DateRange<TDate>;

export const dateRangePickerValueManager: PickerStateValueManager<[any, any], [any, any], any> = {
  emptyValue: [null, null],
  getTodayValue: (utils) => [utils.date()!, utils.date()!],
  parseInput: parseValue,
  areValuesEqual: (utils, a, b) => utils.isEqual(a[0], b[0]) && utils.isEqual(a[1], b[1]),
};

export const isRangeValid = <TDate>(
  utils: MuiPickersAdapter<TDate>,
  range: DateRange<TDate> | null
): range is NonEmptyDateRange<TDate> => {
  return Boolean(range && range[0] && range[1] && !utils.isBefore(range[1], range[0]));
};

export const isWithinRange = <TDate>(utils: MuiPickersAdapter<TDate>, day: TDate, range: DateRange<TDate> | null) => {
  return isRangeValid(utils, range) && utils.isWithinRange(day, range);
};

export const isStartOfRange = <TDate>(utils: MuiPickersAdapter<TDate>, day: TDate, range: DateRange<TDate> | null) => {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[0]!);
};

export const isEndOfRange = <TDate>(utils: MuiPickersAdapter<TDate>, day: TDate, range: DateRange<TDate> | null) => {
  return isRangeValid(utils, range) && utils.isSameDay(day, range[1]!);
};
