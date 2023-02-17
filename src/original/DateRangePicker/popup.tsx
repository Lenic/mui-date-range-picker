import { useCallback, useEffect } from 'react';
import {
  useUtils,
  defaultReduceAnimations,
  ExportedCalendarPickerProps,
  useCalendarState,
  PickerStatePickerProps,
  DayPickerProps,
  BaseDateValidationProps,
  DayValidationProps,
} from '@mui/x-date-pickers/internals';
import { DateRange, FocusPositionProps, DayValidation } from '../internal/models/dateRange';
import { isRangeValid } from '../internal/utils/date-utils';
import { calculateRangeChange } from './date-range-manager';
import type { InputProps } from './input';
import { DesktopPopup, CalendarProps } from './popupDesktop';

export interface ExportedDateRangePickerViewProps<TDate>
  extends CalendarProps<TDate>,
    DayValidation<TDate>,
    Omit<
      ExportedCalendarPickerProps<TDate>,
      'onYearChange' | 'renderDay' | keyof BaseDateValidationProps<TDate> | keyof DayValidationProps<TDate>
    > {
  /**
   * If `true`, after selecting `start` date calendar will not automatically switch to the month of `end` date.
   * @default false
   */
  disableAutoMonthSwitching?: boolean;
  /**
   * className applied to the root component.
   */
  className?: string;
}

interface PopupProps<TInputDate, TDate>
  extends FocusPositionProps,
    ExportedDateRangePickerViewProps<TDate>,
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
    disableAutoMonthSwitching = false,
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
    if (disableAutoMonthSwitching || !open) {
      return;
    }

    scrollToDayIfNeeded(focusPosition === 'start' ? start : end);
  }, [focusPosition, parsedValue, disableAutoMonthSwitching, scrollToDayIfNeeded, end, open, start]);

  const handleSelectedDayChange = useCallback<DayPickerProps<TDate>['onSelectedDaysChange']>(
    (newDate) => {
      const { nextSelection, newRange } = calculateRangeChange({
        newDate,
        utils,
        range: parsedValue,
        currentlySelectingRangeEnd: focusPosition,
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
