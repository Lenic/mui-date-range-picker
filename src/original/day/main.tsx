import type { PropsWithChildren, Ref } from 'react';

import { forwardRef, memo } from 'react';
import clsx from 'clsx';
import { useThemeProps } from '@mui/material/styles';
import { useUtils, areDayPropsEqual } from '@mui/x-date-pickers/internals';

import { DayRenderRoot, DayRenderContainer, DayRenderCore } from './components';

import type { IDateRangeDayProps, TDateRangeDayComponent } from './types';

const DateRangeDayLogic = forwardRef(function DateRangePickerDay<TDate>(
  inProps: IDateRangeDayProps<TDate>,
  ref: Ref<HTMLButtonElement>
) {
  const props = useThemeProps({ props: inProps, name: 'DateRangeDay' });
  const {
    className,
    day,
    outsideCurrentMonth,
    isEndOfHighlighting,
    isEndOfPreselected,
    isHighlighting,
    isPreselected,
    isStartOfHighlighting,
    isStartOfPreselected,
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
        'day-root',
        isHighlighting && !outsideCurrentMonth && 'highlight',
        (isStartOfHighlighting || isStartOfMonth) && 'highlight-start',
        (isEndOfHighlighting || isEndOfMonth) && 'highlight-end',
      ])}
    >
      <DayRenderContainer
        className={clsx([
          'day-container',
          isPreselected && !outsideCurrentMonth && 'preselected',
          (isStartOfPreselected || isStartOfMonth) && 'preselected-start',
          (isEndOfPreselected || isEndOfMonth) && 'preselected-end',
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
            'day-core',
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
  prevProps: Readonly<PropsWithChildren<IDateRangeDayProps<any>>>,
  nextProps: Readonly<PropsWithChildren<IDateRangeDayProps<any>>>
) => {
  return (
    prevProps.isHighlighting === nextProps.isHighlighting &&
    prevProps.isEndOfHighlighting === nextProps.isEndOfHighlighting &&
    prevProps.isStartOfHighlighting === nextProps.isStartOfHighlighting &&
    prevProps.isPreselected === nextProps.isPreselected &&
    prevProps.isEndOfPreselected === nextProps.isEndOfPreselected &&
    prevProps.isStartOfPreselected === nextProps.isStartOfPreselected &&
    areDayPropsEqual(prevProps, nextProps)
  );
};

DateRangeDayLogic.displayName = 'DateRangeDay';
export const DateRangeDay = memo(DateRangeDayLogic, propsAreEqual) as TDateRangeDayComponent;
