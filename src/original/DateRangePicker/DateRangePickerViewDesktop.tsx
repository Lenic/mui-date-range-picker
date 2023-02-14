import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import {
  useDefaultDates,
  useUtils,
  useLocaleText,
  PickersArrowSwitcher,
  ExportedArrowSwitcherProps,
  usePreviousMonthDisabled,
  useNextMonthDisabled,
  DayPicker,
  DayPickerProps,
  DAY_MARGIN,
  DayValidationProps,
} from '@mui/x-date-pickers/internals';
import { calculateRangePreview } from './date-range-manager';
import { DateRange } from '../../dateRangerPicker/internal/models';
import { DateRangeDay, IDateRangeDayProps } from '../day';
import { isWithinRange, isStartOfRange, isEndOfRange } from '../../dateRangerPicker/internal/utils/date-utils';
import { doNothing } from '../../dateRangerPicker/internal/utils/utils';
import {
  DateRangePickerViewDesktopClasses,
  getDateRangePickerViewDesktopUtilityClass,
} from './dateRangePickerViewDesktopClasses';

const useUtilityClasses = (ownerState: DesktopDateRangeCalendarProps<any>) => {
  const { classes } = ownerState;
  const slots = {
    root: ['root'],
    container: ['container'],
  };

  return composeClasses(slots, getDateRangePickerViewDesktopUtilityClass, classes);
};

export interface ExportedDesktopDateRangeCalendarProps<TDate> {
  /**
   * The number of calendars that render on **desktop**.
   * @default 2
   */
  calendars?: 1 | 2 | 3;
  /**
   * Custom renderer for `<DateRangePicker />` days. @DateIOType
   * @example (date, dateRangePickerDayProps) => <DateRangeDay {...dateRangePickerDayProps} />
   * @template TDate
   * @param {TDate} day The day to render.
   * @param {IDateRangeDayProps<TDate>} dateRangePickerDayProps The props of the day to render.
   * @returns {JSX.Element} The element representing the day.
   */
  renderDay?: (day: TDate, dateRangePickerDayProps: IDateRangeDayProps<TDate>) => JSX.Element;
}

export interface DesktopDateRangeCalendarProps<TDate>
  extends ExportedDesktopDateRangeCalendarProps<TDate>,
    Omit<DayPickerProps<TDate>, 'selectedDays' | 'renderDay' | 'onFocusedDayChange' | 'classes'>,
    DayValidationProps<TDate>,
    Omit<ExportedArrowSwitcherProps, 'leftArrowButtonText' | 'rightArrowButtonText'> {
  calendars: 1 | 2 | 3;
  parsedValue: DateRange<TDate>;
  changeMonth: (date: TDate) => void;
  currentlySelectingRangeEnd: 'start' | 'end';
  classes?: Partial<DateRangePickerViewDesktopClasses>;
}

const DateRangePickerViewDesktopRoot = styled('div', {
  name: 'MuiDateRangePickerViewDesktop',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})({
  display: 'flex',
  flexDirection: 'row',
});

const DateRangePickerViewDesktopContainer = styled('div', {
  name: 'MuiDateRangePickerViewDesktop',
  slot: 'Container',
  overridesResolver: (_, styles) => styles.container,
})(({ theme }) => ({
  '&:not(:last-of-type)': {
    borderRight: `2px solid ${theme.palette.divider}`,
  },
}));

const DAY_RANGE_SIZE = 40;

const weeksContainerHeight = (DAY_RANGE_SIZE + DAY_MARGIN * 2) * 6;

const DateRangePickerViewDesktopCalendar = styled(DayPicker)({
  minWidth: 312,
  minHeight: weeksContainerHeight,
}) as typeof DayPicker;

const DateRangePickerViewDesktopArrowSwitcher = styled(PickersArrowSwitcher)({
  padding: '16px 16px 8px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

function getCalendarsArray(calendars: ExportedDesktopDateRangeCalendarProps<unknown>['calendars']) {
  switch (calendars) {
    case 1:
      return [0];
    case 2:
      return [0, 0];
    case 3:
      return [0, 0, 0];
    // this will not work in IE11, but allows to support any amount of calendars
    default:
      return new Array(calendars).fill(0);
  }
}

/**
 * @ignore - internal component.
 */
export function DateRangePickerViewDesktop<TDate>(inProps: DesktopDateRangeCalendarProps<TDate>) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateRangePickerViewDesktop' });
  const {
    calendars,
    changeMonth,
    components,
    componentsProps,
    currentlySelectingRangeEnd,
    currentMonth,
    parsedValue,
    disableFuture,
    disablePast,
    maxDate: maxDateProp,
    minDate: minDateProp,
    onSelectedDaysChange,
    renderDay = (_, dateRangeProps) => <DateRangeDay {...dateRangeProps} />,
    className,
    // excluding classes from `other` to avoid passing them down to children
    classes: providedClasses,
    ...other
  } = props;

  const localeText = useLocaleText();

  const leftArrowButtonText = localeText.previousMonth;
  const rightArrowButtonText = localeText.nextMonth;

  const utils = useUtils<TDate>();
  const classes = useUtilityClasses(props);
  const defaultDates = useDefaultDates<TDate>();
  const minDate = minDateProp ?? defaultDates.minDate;
  const maxDate = maxDateProp ?? defaultDates.maxDate;

  const [rangePreviewDay, setRangePreviewDay] = React.useState<TDate | null>(null);

  const isNextMonthDisabled = useNextMonthDisabled(currentMonth, { disableFuture, maxDate });
  const isPreviousMonthDisabled = usePreviousMonthDisabled(currentMonth, { disablePast, minDate });

  const previewingRange = calculateRangePreview({
    utils,
    range: parsedValue,
    newDate: rangePreviewDay,
    currentlySelectingRangeEnd,
  });

  const handleSelectedDayChange = React.useCallback<DayPickerProps<TDate>['onSelectedDaysChange']>(
    (day) => {
      setRangePreviewDay(null);
      onSelectedDaysChange(day);
    },
    [onSelectedDaysChange]
  );

  const handlePreviewDayChange = (newPreviewRequest: TDate) => {
    if (!isWithinRange(utils, newPreviewRequest, parsedValue)) {
      setRangePreviewDay(newPreviewRequest);
    } else {
      setRangePreviewDay(null);
    }
  };

  const CalendarTransitionProps = React.useMemo(
    () => ({
      onMouseLeave: () => setRangePreviewDay(null),
    }),
    []
  );

  const selectNextMonth = React.useCallback(() => {
    changeMonth(utils.getNextMonth(currentMonth));
  }, [changeMonth, currentMonth, utils]);

  const selectPreviousMonth = React.useCallback(() => {
    changeMonth(utils.getPreviousMonth(currentMonth));
  }, [changeMonth, currentMonth, utils]);

  return (
    <DateRangePickerViewDesktopRoot className={clsx(className, classes.root)}>
      {getCalendarsArray(calendars).map((_, index) => {
        const monthOnIteration = utils.setMonth(currentMonth, utils.getMonth(currentMonth) + index);

        return (
          <DateRangePickerViewDesktopContainer key={index} className={classes.container}>
            <DateRangePickerViewDesktopArrowSwitcher
              onLeftClick={selectPreviousMonth}
              onRightClick={selectNextMonth}
              isLeftHidden={index !== 0}
              isRightHidden={index !== calendars - 1}
              isLeftDisabled={isPreviousMonthDisabled}
              isRightDisabled={isNextMonthDisabled}
              leftArrowButtonText={leftArrowButtonText}
              components={components}
              componentsProps={componentsProps}
              rightArrowButtonText={rightArrowButtonText}
            >
              {utils.format(monthOnIteration, 'monthAndYear')}
            </DateRangePickerViewDesktopArrowSwitcher>
            <DateRangePickerViewDesktopCalendar<TDate>
              {...other}
              minDate={minDate}
              maxDate={maxDate}
              disablePast={disablePast}
              disableFuture={disableFuture}
              key={index}
              selectedDays={parsedValue}
              onFocusedDayChange={doNothing}
              onSelectedDaysChange={handleSelectedDayChange}
              currentMonth={monthOnIteration}
              TransitionProps={CalendarTransitionProps}
              renderDay={(day, __, DayProps) =>
                renderDay(day, {
                  isPreviewing: isWithinRange(utils, day, previewingRange),
                  isStartOfPreviewing: isStartOfRange(utils, day, previewingRange),
                  isEndOfPreviewing: isEndOfRange(utils, day, previewingRange),
                  isHighlighting: isWithinRange(utils, day, parsedValue),
                  isStartOfHighlighting: isStartOfRange(utils, day, parsedValue),
                  isEndOfHighlighting: isEndOfRange(utils, day, parsedValue),
                  onMouseEnter: () => handlePreviewDayChange(day),
                  ...DayProps,
                })
              }
            />
          </DateRangePickerViewDesktopContainer>
        );
      })}
    </DateRangePickerViewDesktopRoot>
  );
}