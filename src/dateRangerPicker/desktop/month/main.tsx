import type { FC } from 'react';
import type { Dayjs } from 'dayjs';
import type { DayPickerProps } from '@mui/x-date-pickers/internals';

// import type { DateRangePickerDayProps } from '../days';

import dayjs from 'dayjs';
import { useCallback, useMemo } from 'react';
import { useUtils } from '@mui/x-date-pickers/internals';

import { useLeftMonth, useSelectedDays } from '../context';
// import { DateRangePickerDay } from '../days';

import { Calendar } from './styles';
import { Switcher, Container, Wrapper } from './styles';

const doNothing = () => {};
const minDate = dayjs(new Date(2000, 1, 1));
const maxDate = dayjs(new Date(2099, 1, 1));

export type TMonthViewProps = {};

export const MonthView: FC<TMonthViewProps> = () => {
  const { leftMonth, setLeftMonth } = useLeftMonth();
  const { selectedDays, setSelectedDays } = useSelectedDays();
  const handleSelectNextMonth = useCallback(() => setLeftMonth((cur) => cur.add(1, 'month')), [setLeftMonth]);
  const handleSelectPreviousMonth = useCallback(() => setLeftMonth((cur) => cur.subtract(1, 'month')), [setLeftMonth]);

  const utils = useUtils<Dayjs>();
  const months = useMemo(
    () => [utils.format(leftMonth, 'monthAndYear'), utils.format(leftMonth.add(1, 'month'), 'monthAndYear')],
    [leftMonth, utils]
  );

  const handleSelectedDayChange: DayPickerProps<Dayjs>['onSelectedDaysChange'] = useCallback(() => {}, []);

  return (
    <Wrapper>
      <Container>
        <Switcher
          onLeftClick={handleSelectPreviousMonth}
          onRightClick={handleSelectNextMonth}
          isRightHidden
          isLeftDisabled={false}
          isRightDisabled={false}
          leftArrowButtonText={'前一个月'}
          rightArrowButtonText={'后一个月'}
        >
          {months[0]}
        </Switcher>
        <Calendar
          minDate={minDate}
          maxDate={maxDate}
          disablePast={true}
          focusedDay={null}
          slideDirection="left"
          reduceAnimations={false}
          isMonthSwitchingAnimating
          onMonthSwitchingAnimationEnd={() => {}}
          disableFuture={true}
          selectedDays={selectedDays}
          onFocusedDayChange={doNothing}
          onSelectedDaysChange={handleSelectedDayChange}
          currentMonth={leftMonth}
          renderDay={(day, _, DayProps) => <span key={DayProps.key}>{day.date()}</span>}
        />
      </Container>
      <Container>
        <Switcher
          onLeftClick={handleSelectPreviousMonth}
          onRightClick={handleSelectNextMonth}
          isLeftHidden
          isLeftDisabled={false}
          isRightDisabled={false}
          leftArrowButtonText={'前一个月'}
          rightArrowButtonText={'后一个月'}
        >
          {months[1]}
        </Switcher>
        <Calendar
          minDate={minDate}
          maxDate={maxDate}
          disablePast={true}
          focusedDay={null}
          slideDirection="left"
          reduceAnimations={false}
          isMonthSwitchingAnimating
          onMonthSwitchingAnimationEnd={() => {}}
          disableFuture={true}
          selectedDays={selectedDays}
          onFocusedDayChange={doNothing}
          onSelectedDaysChange={handleSelectedDayChange}
          currentMonth={leftMonth}
          renderDay={(day, _, DayProps) => <span key={DayProps.key}>{day.date()}</span>}
        />
      </Container>
    </Wrapper>
  );
};
