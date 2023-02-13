import * as React from 'react';
import clsx from 'clsx';
import { SxProps } from '@mui/system';
import { alpha, styled, Theme, useThemeProps } from '@mui/material/styles';
import { unstable_composeClasses as composeClasses } from '@mui/material';
import { DAY_MARGIN, useUtils, areDayPropsEqual } from '@mui/x-date-pickers/internals';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import {
  DateRangePickerDayClasses,
  getDateRangePickerDayUtilityClass,
  dateRangePickerDayClasses,
} from './dateRangePickerDayClasses';

export interface DateRangePickerDayProps<TDate>
  extends Omit<PickersDayProps<TDate>, 'classes' | 'onBlur' | 'onFocus' | 'onKeyDown'> {
  /**
   * Set to `true` if the `day` is in a highlighted date range.
   */
  isHighlighting: boolean;
  /**
   * Set to `true` if the `day` is the end of a highlighted date range.
   */
  isEndOfHighlighting: boolean;
  /**
   * Set to `true` if the `day` is the start of a highlighted date range.
   */
  isStartOfHighlighting: boolean;
  /**
   * Set to `true` if the `day` is in a preview date range.
   */
  isPreviewing: boolean;
  /**
   * Set to `true` if the `day` is the start of a highlighted date range.
   */
  isEndOfPreviewing: boolean;
  /**
   * Set to `true` if the `day` is the end of a highlighted date range.
   */
  isStartOfPreviewing: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<DateRangePickerDayClasses>;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

type OwnerState = DateRangePickerDayProps<any> & { isEndOfMonth: boolean; isStartOfMonth: boolean };

const useUtilityClasses = (ownerState: OwnerState) => {
  const {
    isHighlighting,
    outsideCurrentMonth,
    isStartOfHighlighting,
    isStartOfMonth,
    isEndOfHighlighting,
    isEndOfMonth,
    isPreviewing,
    isStartOfPreviewing,
    isEndOfPreviewing,
    selected,
    classes,
  } = ownerState;

  const slots = {
    root: [
      'root',
      isHighlighting && !outsideCurrentMonth && 'highlight',
      (isStartOfHighlighting || isStartOfMonth) && 'highlight-start',
      (isEndOfHighlighting || isEndOfMonth) && 'highlight-end',
    ],
    isPreselected: [
      'preselected-base',
      isPreviewing && !outsideCurrentMonth && 'preselected-state',
      (isStartOfPreviewing || isStartOfMonth) && 'preselected-start',
      (isEndOfPreviewing || isEndOfMonth) && 'preselected-end',
    ],
    day: [
      'day',
      !selected && 'not-selected',
      !isHighlighting && 'day-outside',
      !selected && isHighlighting && 'day-inside',
    ],
  };

  return composeClasses(slots, getDateRangePickerDayUtilityClass, classes);
};

const endBorderStyle = {
  borderTopRightRadius: '50%',
  borderBottomRightRadius: '50%',
};

const startBorderStyle = {
  borderTopLeftRadius: '50%',
  borderBottomLeftRadius: '50%',
};

const DayRenderRoot = styled('div', {
  name: 'day-render',
  slot: 'Root',
  overridesResolver: (_, styles) => [
    {
      [`&.${dateRangePickerDayClasses.highlight}`]: styles.highlight,
    },
    {
      [`&.${dateRangePickerDayClasses['highlight-start']}`]: styles['highlight-start'],
    },
    {
      [`&.${dateRangePickerDayClasses['highlight-end']}`]: styles['highlight-end'],
    },
    styles.root,
  ],
})<{ ownerState: OwnerState }>(({ theme, ownerState }) => ({
  [`&:first-of-type .${dateRangePickerDayClasses['preselected-state']}`]: {
    ...startBorderStyle,
    borderLeftColor: theme.palette.divider,
  },
  [`&:last-of-type .${dateRangePickerDayClasses['preselected-state']}`]: {
    ...endBorderStyle,
    borderRightColor: theme.palette.divider,
  },
  ...(ownerState.isHighlighting &&
    !ownerState.outsideCurrentMonth && {
      borderRadius: 0,
      color: theme.palette.primary.contrastText,
      backgroundColor: alpha(theme.palette.primary.light, 0.6),
      '&:first-of-type': startBorderStyle,
      '&:last-of-type': endBorderStyle,
    }),
  ...((ownerState.isStartOfHighlighting || ownerState.isStartOfMonth) && {
    ...startBorderStyle,
    paddingLeft: 0,
    marginLeft: DAY_MARGIN / 2,
  }),
  ...((ownerState.isEndOfHighlighting || ownerState.isEndOfMonth) && {
    ...endBorderStyle,
    paddingRight: 0,
    marginRight: DAY_MARGIN / 2,
  }),
}));

const DayRenderContainer = styled('div', {
  name: 'day-render',
  slot: 'container',
  overridesResolver: (_, styles) => [
    { [`&.${dateRangePickerDayClasses['preselected-state']}`]: styles['preselected-state'] },
    {
      [`&.${dateRangePickerDayClasses['preselected-start']}`]: styles['preselected-start'],
    },
    {
      [`&.${dateRangePickerDayClasses['preselected-end']}`]: styles['preselected-end'],
    },
    styles['preselected-base'],
  ],
})<{ ownerState: OwnerState }>(({ theme, ownerState }) => ({
  // replace default day component margin with transparent border to avoid jumping on preview
  border: '2px solid transparent',
  ...(ownerState.isPreviewing &&
    !ownerState.outsideCurrentMonth && {
      borderRadius: 0,
      border: `2px dashed ${theme.palette.divider}`,
      borderLeftColor: 'transparent',
      borderRightColor: 'transparent',
      ...((ownerState.isStartOfPreviewing || ownerState.isStartOfMonth) && {
        borderLeftColor: theme.palette.divider,
        ...startBorderStyle,
      }),
      ...((ownerState.isEndOfPreviewing || ownerState.isEndOfMonth) && {
        borderRightColor: theme.palette.divider,
        ...endBorderStyle,
      }),
    }),
}));

const DayRenderCore = styled(PickersDay, {
  name: 'day-render',
  slot: 'core',
  overridesResolver: (_, styles) => [
    { [`&.${dateRangePickerDayClasses['day-inside']}`]: styles['day-inside'] },
    { [`&.${dateRangePickerDayClasses['day-outside']}`]: styles['day-outside'] },
    { [`&.${dateRangePickerDayClasses['not-selected']}`]: styles['not-selected'] },
    styles.day,
  ],
})<{
  ownerState: OwnerState;
}>(({ theme, ownerState }) => ({
  // Required to overlap preview border
  transform: 'scale(1.1)',
  '& > *': {
    transform: 'scale(0.9)',
  },
  ...(!ownerState.selected && {
    backgroundColor: 'transparent',
  }),
  ...(!ownerState.isHighlighting && {
    '&:hover': {
      border: `1px solid ${theme.palette.grey[500]}`,
    },
  }),
  ...(!ownerState.selected &&
    ownerState.isHighlighting && {
      color: theme.palette.getContrastText(alpha(theme.palette.primary.light, 0.6)),
    }),
})) as unknown as <TDate>(props: PickersDayProps<TDate> & { ownerState: OwnerState }) => JSX.Element;

type DateRangePickerDayComponent = <TDate>(
  props: DateRangePickerDayProps<TDate> & React.RefAttributes<HTMLButtonElement>
) => JSX.Element;

const DateRangePickerDayRaw = React.forwardRef(function DateRangePickerDay<TDate>(
  inProps: DateRangePickerDayProps<TDate>,
  ref: React.Ref<HTMLButtonElement>
) {
  const props = useThemeProps({ props: inProps, name: 'MuiDateRangePickerDay' });
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

  const ownerState = {
    ...props,
    selected,
    isStartOfMonth,
    isEndOfMonth,
  };

  const classes = useUtilityClasses(ownerState);

  return (
    <DayRenderRoot className={clsx(classes.root, className)} ownerState={ownerState}>
      <DayRenderContainer className={classes.isPreselected} ownerState={ownerState}>
        <DayRenderCore<TDate>
          {...other}
          ref={ref}
          disableMargin
          day={day}
          selected={selected}
          outsideCurrentMonth={outsideCurrentMonth}
          className={classes.day}
          ownerState={ownerState}
        />
      </DayRenderContainer>
    </DayRenderRoot>
  );
});

const propsAreEqual = (
  prevProps: Readonly<React.PropsWithChildren<DateRangePickerDayProps<any>>>,
  nextProps: Readonly<React.PropsWithChildren<DateRangePickerDayProps<any>>>
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

DateRangePickerDayRaw.displayName = 'DayRender';
/**
 *
 * Demos:
 *
 * - [Date Range Picker](https://mui.com/x/react-date-pickers/date-range-picker/)
 *
 * API:
 *
 * - [DateRangePickerDay API](https://mui.com/x/api/date-pickers/date-range-picker-day/)
 */
export const DateRangePickerDay = React.memo(DateRangePickerDayRaw, propsAreEqual) as DateRangePickerDayComponent;
