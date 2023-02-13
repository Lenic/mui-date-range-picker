import { generateUtilityClass, generateUtilityClasses } from '@mui/material';

export interface DateRangePickerDayClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if `isHighlighting=true` and `outsideCurrentMonth=false`. */
  highlight: string;
  /** Styles applied to the root element if `isStartOfHighlighting=true` or `day` is the start of the month. */
  'highlight-start': string;
  /** Styles applied to the root element if `isEndOfHighlighting=true` or `day` is the end of the month. */
  'highlight-end': string;
  /** Styles applied to the preview element. */
  'preselected-base': string;
  /** Styles applied to the root element if `isPreviewing=true` and `outsideCurrentMonth=false`. */
  'preselected-state': string;
  /** Styles applied to the root element if `isStartOfPreviewing=true` or `day` is the start of the month. */
  'preselected-start': string;
  /** Styles applied to the root element if `isEndOfPreviewing=true` or `day` is the end of the month. */
  'preselected-end': string;
  /** Styles applied to the day element. */
  day: string;
  /** Styles applied to the day element if `isHighlighting=false`. */
  'day-outside': string;
  /** Styles applied to the day element if `selected=false` and `isHighlighting=true`. */
  'day-inside': string;
  /** Styles applied to the day element if `selected=false`. */
  'not-selected': string;
}

export type DateRangePickerDayClassKey = keyof DateRangePickerDayClasses;

const componentName = 'day-render';
export const getDateRangePickerDayUtilityClass = generateUtilityClass.bind(null, componentName);
export const dateRangePickerDayClasses: DateRangePickerDayClasses = generateUtilityClasses(componentName, [
  'root',
  'highlight',
  'highlight-start',
  'highlight-end',
  'preselected-base',
  'preselected-state',
  'preselected-start',
  'preselected-end',
  'day',
  'day-outside',
  'day-inside',
  'not-selected',
]);
