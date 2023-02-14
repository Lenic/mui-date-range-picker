import * as React from 'react';
import clsx from 'clsx';
import { useThemeProps } from '@mui/material/styles';
import { useUtils, areDayPropsEqual } from '@mui/x-date-pickers/internals';

import { DayRenderRoot, DayRenderContainer, DayRenderCore } from './components';

import type { IDateRangeDayProps, TDateRangeDayComponent } from './types';

const DateRangeDayLogic = React.forwardRef(function DateRangePickerDay<TDate>(
  inProps: IDateRangeDayProps<TDate>,
  ref: React.Ref<HTMLButtonElement>
) {
  const props = useThemeProps({ props: inProps, name: 'DateRangeDay' });
  const {
    className,
    day,
    outsideCurrentMonth,
    isEndOfHighlighting,
    isEndOfPreviewing,
    isHighlighting,
    isPreviewing,
    isStartOfHighlighting,
    isStartOfPreviewing,
    selected = false,
    ...other
  } = props;

  const utils = useUtils<TDate>();

  const isEndOfMonth = utils.isSameDay(day, utils.endOfMonth(day));
  const isStartOfMonth = utils.isSameDay(day, utils.startOfMonth(day));

  return (
    <DayRenderRoot
      className={clsx([
        className,
        isHighlighting && !outsideCurrentMonth && 'highlight',
        (isStartOfHighlighting || isStartOfMonth) && 'highlight-start',
        (isEndOfHighlighting || isEndOfMonth) && 'highlight-end',
      ])}
    >
      <DayRenderContainer
        className={clsx([
          isPreviewing && !outsideCurrentMonth && 'preselected',
          (isStartOfPreviewing || isStartOfMonth) && 'preselected-start',
          (isEndOfPreviewing || isEndOfMonth) && 'preselected-end',
        ])}
      >
        <DayRenderCore<TDate>
          {...other}
          ref={ref}
          disableMargin
          day={day}
          selected={selected}
          outsideCurrentMonth={outsideCurrentMonth}
          className={clsx([
            !selected && 'not-selected',
            !isHighlighting && 'day-outside',
            !selected && isHighlighting && 'day-inside',
          ])}
        />
      </DayRenderContainer>
    </DayRenderRoot>
  );
});

const propsAreEqual = (
  prevProps: Readonly<React.PropsWithChildren<IDateRangeDayProps<any>>>,
  nextProps: Readonly<React.PropsWithChildren<IDateRangeDayProps<any>>>
) => {
  return (
    prevProps.isHighlighting === nextProps.isHighlighting &&
    prevProps.isEndOfHighlighting === nextProps.isEndOfHighlighting &&
    prevProps.isStartOfHighlighting === nextProps.isStartOfHighlighting &&
    prevProps.isPreviewing === nextProps.isPreviewing &&
    prevProps.isEndOfPreviewing === nextProps.isEndOfPreviewing &&
    prevProps.isStartOfPreviewing === nextProps.isStartOfPreviewing &&
    areDayPropsEqual(prevProps, nextProps)
  );
};

DateRangeDayLogic.displayName = 'DateRangeDay';
export const DateRangeDay = React.memo(DateRangeDayLogic, propsAreEqual) as TDateRangeDayComponent;
