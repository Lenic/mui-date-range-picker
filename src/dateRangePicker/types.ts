import type { SxProps } from '@mui/system';
import type { Theme } from '@mui/material/styles';
import type { ReactElement, RefAttributes } from 'react';
import type { PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import type { DesktopWrapperProps } from '@mui/x-date-pickers/internals';
import type { ExportedCalendarPickerProps, DayValidationProps } from '@mui/x-date-pickers/internals';
import type { BasePickerProps, DateValidationError, ValidationProps } from '@mui/x-date-pickers/internals';
import type { BaseDateValidationProps, ExportedDateInputProps, MuiTextFieldProps } from '@mui/x-date-pickers/internals';

export interface IInputRender<TInputDate, TDate>
  extends Omit<ExportedDateInputProps<TInputDate, TDate>, 'renderInput'> {
  /**
   * The `renderInput` prop allows you to customize the rendered input.
   * The `startProps` and `endProps` arguments of this render prop contains props of [TextField](https://mui.com/material-ui/api/text-field/#props),
   * that you need to forward to the range start/end inputs respectively.
   * Pay specific attention to the `ref` and `inputProps` keys.
   * @example
   * ```jsx
   * <DateRangePicker
   *  renderInput={(startProps, endProps) => (
   *   <React.Fragment>
   *     <TextField {...startProps} />
   *     <Box sx={{ mx: 2 }}> to </Box>
   *     <TextField {...endProps} />
   *   </React.Fragment>;
   *  )}
   * />
   * ````
   * @param {MuiTextFieldProps} startProps Props that you need to forward to the range start input.
   * @param {MuiTextFieldProps} endProps Props that you need to forward to the range end input.
   * @returns {React.ReactElement} The range input to render.
   */
  renderInput: (startProps: MuiTextFieldProps, endProps: MuiTextFieldProps) => ReactElement;
  onChange: (date: DateRange<TDate>, keyboardInputValue?: string) => void;
}

export type DateRange<TDate> = [TDate | null, TDate | null];
export type TNonEmptyDateRange<TDate> = [TDate, TDate];

/**
 * 当前输入的焦点在哪个位置
 *
 * - 两个日期输入框中前面的位置，值为 `start`
 * - 两个日期输入框中后面的位置，值为 `end`
 */
export type TFocusPosition = 'start' | 'end';

export interface IFocusPositionProps {
  focusPosition: TFocusPosition;
  setFocusPosition: (position: TFocusPosition) => void;
}

/**
 * Props used to validate a day value in range pickers.
 */
export interface IDayValidation<TDate> {
  /**
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to test.
   * @param {string} position The date to test, 'start' or 'end'.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate?: (day: TDate, position: TFocusPosition) => boolean;
}

export interface IDateRangeDayProps<TDate>
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
  isPreselected: boolean;
  /**
   * Set to `true` if the `day` is the start of a highlighted date range.
   */
  isEndOfPreselected: boolean;
  /**
   * Set to `true` if the `day` is the end of a highlighted date range.
   */
  isStartOfPreselected: boolean;
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

export interface ICalendarRender<TDate> {
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

type TCalendarPickerProps<TDate> = Omit<
  ExportedCalendarPickerProps<TDate>,
  'onYearChange' | 'renderDay' | keyof BaseDateValidationProps<TDate> | keyof DayValidationProps<TDate>
>;

export interface ICalendarProps<TDate>
  extends ICalendarRender<TDate>,
    IDayValidation<TDate>,
    TCalendarPickerProps<TDate> {
  /**
   * className applied to the root component.
   */
  className?: string;
}

export type ValidationError = DateValidationError | 'invalidRange' | null;

export type TValidationErrors = [ValidationError, ValidationError];

export interface IBaseDateRangePickerProps<TInputDate, TDate>
  extends Omit<BasePickerProps<DateRange<TInputDate>, DateRange<TDate>>, 'orientation'>,
    ICalendarProps<TDate>,
    BaseDateValidationProps<TDate>,
    ValidationProps<TValidationErrors, DateRange<TInputDate>>,
    IInputRender<TInputDate, TDate> {
  /**
   * Custom mask. Can be used to override generate from format. (e.g. `__/__/____ __:__` or `__/__/____ __:__ _M`).
   * @default '__/__/____'
   */
  mask?: IInputRender<TInputDate, TDate>['mask'];
  /**
   * Callback fired when the value (the selected date range) changes @DateIOType.
   * @template TDate
   * @param {DateRange<TDate>} date The new parsed date range.
   * @param {string} keyboardInputValue The current value of the keyboard input.
   */
  onChange: (date: DateRange<TDate>, keyboardInputValue?: string) => void;
}

export type TDateRangePickerProps<TInputDate, TDate> = Omit<
  IBaseDateRangePickerProps<TInputDate, TDate>,
  'endText' | 'startText'
> &
  DesktopWrapperProps;

export type TDateRangePickerComponent = <TInputDate, TDate = TInputDate>(
  props: TDateRangePickerProps<TInputDate, TDate> & RefAttributes<HTMLDivElement>
) => JSX.Element;
