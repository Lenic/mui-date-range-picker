import { MuiPickersAdapter } from '@mui/x-date-pickers/internals';
import { DateRange, TFocusPosition } from '../internal/models';

interface CalculateRangeChangeOptions<TDate> {
  utils: MuiPickersAdapter<TDate>;
  range: DateRange<TDate>;
  newDate: TDate;
  focusPosition: TFocusPosition;
}

export function calculateRangeChange<TDate>({
  utils,
  range,
  newDate: selectedDate,
  focusPosition,
}: CalculateRangeChangeOptions<TDate>): {
  nextSelection: TFocusPosition;
  newRange: DateRange<TDate>;
} {
  const [start, end] = range;

  if (focusPosition === 'start') {
    return Boolean(end) && utils.isAfter(selectedDate, end!)
      ? { nextSelection: 'end', newRange: [selectedDate, null] }
      : { nextSelection: 'end', newRange: [selectedDate, end] };
  }

  return Boolean(start) && utils.isBefore(selectedDate, start!)
    ? { nextSelection: 'end', newRange: [selectedDate, null] }
    : { nextSelection: 'start', newRange: [start, selectedDate] };
}

export function calculateRangePreview<TDate>(options: CalculateRangeChangeOptions<TDate>): DateRange<TDate> {
  if (!options.newDate) {
    return [null, null];
  }

  const [start, end] = options.range;
  const { newRange } = calculateRangeChange(options);

  if (!start || !end) {
    return newRange;
  }

  const [previewStart, previewEnd] = newRange;
  return options.focusPosition === 'end' ? [end, previewEnd] : [previewStart, start];
}
