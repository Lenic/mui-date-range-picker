import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import {
  useDefaultDates,
  useUtils,
  useLocaleText,
  PickersArrowSwitcher,
  usePreviousMonthDisabled,
  useNextMonthDisabled,
  DayPicker,
  DayPickerProps,
  DAY_MARGIN,
  DayValidationProps,
} from '@mui/x-date-pickers/internals';

import { DateRangeDay, IDateRangeDayProps } from '../day';
import { DateRange, TFocusPosition } from '../internal/models';
import { doNothing } from '../internal/utils/utils';
import { isWithinRange, isStartOfRange, isEndOfRange } from '../internal/utils/date-utils';

import { calculateRangePreview } from './date-range-manager';

export interface CalendarProps<TDate> {
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
  extends CalendarProps<TDate>,
    Omit<DayPickerProps<TDate>, 'selectedDays' | 'renderDay' | 'onFocusedDayChange' | 'classes'>,
    DayValidationProps<TDate> {
  parsedValue: DateRange<TDate>;
  changeMonth: (date: TDate) => void;
  currentlySelectingRangeEnd: TFocusPosition;
}

const Container = styled('div')({ display: 'flex', flexDirection: 'row' });

const Panel = styled('div')(({ theme }) => ({
  '&:not(:last-of-type)': {
    borderRight: `2px solid ${theme.palette.divider}`,
  },
}));

const DAY_RANGE_SIZE = 40;
const weeksContainerHeight = (DAY_RANGE_SIZE + DAY_MARGIN * 2) * 6;
const Calendar = styled(DayPicker)({
  minWidth: 312,
  minHeight: weeksContainerHeight,
}) as typeof DayPicker;

const ArrowSwitcher = styled(PickersArrowSwitcher)(({ theme }) => ({
  padding: theme.spacing(2),
  paddingBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const calendars = new Array(2).fill(0);

/**
 * @ignore - internal component.
 */
export function DesktopPopup<TDate>(inProps: DesktopDateRangeCalendarProps<TDate>) {
  const props = useThemeProps({ props: inProps, name: 'DesktopView' });
  const {
    changeMonth,
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
    ...other
  } = props;

  /**
   * 获取缺省日期设置
   */
  const defaultDates = useDefaultDates<TDate>();
  /**
   * 可以选择的最小日期
   */
  const minDate = minDateProp ?? defaultDates.minDate;
  /**
   * 可以选择的最大日期
   */
  const maxDate = maxDateProp ?? defaultDates.maxDate;

  /**
   * 当前鼠标 hover 的日期，也可以说是预选的日期
   *
   * - 如果日期在选中的区域，则设置为 `null`
   * - 是开始还是结束日期，需要和 `currentlySelectingRangeEnd` 属性关联
   */
  const [rangePreviewDay, setRangePreviewDay] = useState<TDate | null>(null);

  /**
   * 日期操作帮助类集合
   */
  const utils = useUtils<TDate>();
  /**
   * 获取预选的开始和结束日期
   */
  const previewingRange = calculateRangePreview({
    // 日期操作帮助类集合
    utils,
    // 已选中的日期范围，包含开始和结束
    range: parsedValue,
    // 当前鼠标 hover 的日期：可 null 的日期
    newDate: rangePreviewDay,
    // 当前处于焦点状态的输入框：开始日期输入框、结束日期输入框
    currentlySelectingRangeEnd,
  });

  /**
   * 在点选日期后的操作
   *
   * - 首先立即置 `null` 鼠标 hover 日期，因为选中的日期上，不能有鼠标 hover 日期
   * - 立即向上触发选择日期变更事件，更新 `parsedValue` 日期，即选中的日期范围
   */
  const handleSelectedDayChange = useCallback<DayPickerProps<TDate>['onSelectedDaysChange']>(
    (day) => {
      setRangePreviewDay(null);
      onSelectedDaysChange(day);
    },
    [onSelectedDaysChange]
  );

  /**
   * 在鼠标 hover 的目标日期发生变更后，更新存储的鼠标 hover 日期
   */
  const handlePreviewDayChange = (newPreviewRequest: TDate) => {
    if (!isWithinRange(utils, newPreviewRequest, parsedValue)) {
      setRangePreviewDay(newPreviewRequest);
    } else {
      setRangePreviewDay(null);
    }
  };

  /**
   * 在鼠标移出日期时，立即置 `null` 鼠标 hover 日期
   */
  const CalendarTransitionProps = useMemo(() => ({ onMouseLeave: () => setRangePreviewDay(null) }), []);

  const selectNextMonth = useCallback(() => {
    changeMonth(utils.getNextMonth(currentMonth));
  }, [changeMonth, currentMonth, utils]);

  const selectPreviousMonth = useCallback(() => {
    changeMonth(utils.getPreviousMonth(currentMonth));
  }, [changeMonth, currentMonth, utils]);

  const localeText = useLocaleText();
  const isNextMonthDisabled = useNextMonthDisabled(currentMonth, { disableFuture, maxDate });
  const isPreviousMonthDisabled = usePreviousMonthDisabled(currentMonth, { disablePast, minDate });
  return (
    <Container className={clsx('desktop-container', className)}>
      {calendars.map((_, index) => {
        const monthOnIteration = utils.setMonth(currentMonth, utils.getMonth(currentMonth) + index);

        return (
          <Panel key={index} className="desktop-panel">
            <ArrowSwitcher
              onLeftClick={selectPreviousMonth}
              onRightClick={selectNextMonth}
              isLeftHidden={index !== 0}
              isRightHidden={index !== 1}
              isLeftDisabled={isPreviousMonthDisabled}
              isRightDisabled={isNextMonthDisabled}
              leftArrowButtonText={localeText.previousMonth}
              rightArrowButtonText={localeText.nextMonth}
            >
              {utils.format(monthOnIteration, 'monthAndYear')}
            </ArrowSwitcher>
            <Calendar<TDate>
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
          </Panel>
        );
      })}
    </Container>
  );
}
