import type { MuiPickersAdapter } from '@mui/x-date-pickers/internals';

import type { DateRange, TFocusPosition } from '../types';

export type TCalculateRangeChangeOptions<TDate> = {
  utils: MuiPickersAdapter<TDate>;
  highlightedRange: DateRange<TDate>;
  newDate: TDate;
  focusPosition: TFocusPosition;
};

export type TChangeRangeResult<TDate> = {
  nextSelection: TFocusPosition;
  newRange: DateRange<TDate>;
};

export function calculateChangeRange<TDate>(options: TCalculateRangeChangeOptions<TDate>): TChangeRangeResult<TDate> {
  const { utils, highlightedRange, newDate: selectedDate, focusPosition } = options;
  const [start, end] = highlightedRange;

  if (focusPosition === 'start') {
    return !!end && utils.isAfter(selectedDate, end!)
      ? { nextSelection: 'end', newRange: [selectedDate, null] }
      : { nextSelection: 'end', newRange: [selectedDate, end] };
  }

  return !!start && utils.isBefore(selectedDate, start!)
    ? { nextSelection: 'end', newRange: [selectedDate, null] }
    : { nextSelection: 'start', newRange: [start, selectedDate] };
}

export function calculateHighlightRange<TDate>(options: TCalculateRangeChangeOptions<TDate>): DateRange<TDate> {
  if (!options.newDate) {
    return [null, null];
  }

  const [start, end] = options.highlightedRange;
  const { newRange } = calculateChangeRange(options);

  if (!start || !end) {
    return newRange;
  }

  const [previewStart, previewEnd] = newRange;
  return options.focusPosition === 'end' ? [end, previewEnd] : [previewStart, start];
}
