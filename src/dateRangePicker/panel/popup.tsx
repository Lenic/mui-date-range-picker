import type { ICalendarProps, DateRange, IFocusPositionProps } from '../types';

import { useCallback, useEffect } from 'react';
import {
  useUtils,
  defaultReduceAnimations,
  useCalendarState,
  PickerStatePickerProps,
  DayPickerProps,
  BaseDateValidationProps,
} from '@mui/x-date-pickers/internals';

import { calculateChangeRange, isRangeValid } from '../utils';

import type { InputProps } from './input';
import { DesktopPopup } from './popupDesktop';

interface PopupProps<TInputDate, TDate>
  extends IFocusPositionProps,
    ICalendarProps<TDate>,
    PickerStatePickerProps<DateRange<TDate>>,
    Required<BaseDateValidationProps<TDate>> {
  open: boolean;
  DateInputProps: InputProps<TInputDate, TDate>;
}

/**
 * @ignore - internal component.
 */
export function Popup<TInputDate, TDate>(props: PopupProps<TInputDate, TDate>) {
  const {
    className,
    focusPosition,
    parsedValue,
    DateInputProps,
    defaultCalendarMonth,
    disableFuture,
    disableHighlightToday,
    disablePast,
    isMobileKeyboardViewOpen,
    maxDate,
    minDate,
    onDateChange,
    onMonthChange,
    open,
    reduceAnimations = defaultReduceAnimations,
    setFocusPosition,
    shouldDisableDate,
    toggleMobileKeyboardView,
    ...other
  } = props;

  const wrappedShouldDisableDate = useCallback(
    (dayToTest: TDate) => shouldDisableDate?.(dayToTest, focusPosition) || false,
    [focusPosition, shouldDisableDate]
  );

  const [start, end] = parsedValue;
  const { changeMonth, calendarState, isDateDisabled, onMonthSwitchingAnimationEnd, changeFocusedDay } =
    useCalendarState({
      date: start || end,
      defaultCalendarMonth,
      disableFuture,
      disablePast,
      disableSwitchToMonthOnDayFocus: true,
      maxDate,
      minDate,
      onMonthChange,
      reduceAnimations,
      shouldDisableDate: wrappedShouldDisableDate,
    });

  const utils = useUtils<TDate>();
  const scrollToDayIfNeeded = useCallback(
    (day: TDate | null) => {
      if (!day || !utils.isValid(day) || isDateDisabled(day)) {
        return;
      }

      const currentlySelectedDate = focusPosition === 'start' ? start : end;
      if (currentlySelectedDate === null) {
        // do not scroll if one of ages is not selected
        return;
      }

      const displayingMonthRange = 1;
      const currentMonthNumber = utils.getMonth(calendarState.currentMonth);
      const requestedMonthNumber = utils.getMonth(day);

      if (
        !utils.isSameYear(calendarState.currentMonth, day) ||
        requestedMonthNumber < currentMonthNumber ||
        requestedMonthNumber > currentMonthNumber + displayingMonthRange
      ) {
        const newMonth =
          focusPosition === 'start'
            ? currentlySelectedDate
            : // If need to focus end, scroll to the state when "end" is displaying in the last calendar
              utils.addMonths(currentlySelectedDate, -displayingMonthRange);

        changeMonth(newMonth);
      }
    },
    [calendarState.currentMonth, changeMonth, focusPosition, end, isDateDisabled, start, utils]
  );

  useEffect(() => {
    if (!open) return;

    scrollToDayIfNeeded(focusPosition === 'start' ? start : end);
  }, [focusPosition, parsedValue, scrollToDayIfNeeded, end, open, start]);

  const handleSelectedDayChange = useCallback<DayPickerProps<TDate>['onSelectedDaysChange']>(
    (newDate) => {
      const { nextSelection, newRange } = calculateChangeRange({
        newDate,
        utils,
        highlightedRange: parsedValue,
        focusPosition,
      });

      setFocusPosition(nextSelection);

      const isFullRangeSelected = focusPosition === 'end' && isRangeValid(utils, newRange);

      onDateChange(newRange as DateRange<TDate>, 'desktop', isFullRangeSelected ? 'finish' : 'partial');
    },
    [focusPosition, parsedValue, onDateChange, setFocusPosition, utils]
  );

  const sharedCalendarProps = {
    parsedValue,
    changeFocusedDay,
    onSelectedDaysChange: handleSelectedDayChange,
    reduceAnimations,
    disableHighlightToday,
    onMonthSwitchingAnimationEnd,
    changeMonth,
    focusPosition,
    disableFuture,
    disablePast,
    minDate,
    maxDate,
    shouldDisableDate: wrappedShouldDisableDate,
    ...calendarState,
    ...other,
  };

  return (
    <div className={className}>
      <DesktopPopup {...sharedCalendarProps} />
    </div>
  );
}
