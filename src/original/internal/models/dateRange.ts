export type DateRange<TDate> = [TDate | null, TDate | null];
export type NonEmptyDateRange<TDate> = [TDate, TDate];

/**
 * 当前输入的焦点在哪个位置
 *
 * - 两个日期输入框中前面的位置，值为 `start`
 * - 两个日期输入框中后面的位置，值为 `end`
 */
export type TFocusPosition = 'start' | 'end';

export interface CurrentlySelectingRangeEndProps {
  currentlySelectingRangeEnd: TFocusPosition;
  setCurrentlySelectingRangeEnd: (newSelectingEnd: TFocusPosition) => void;
}

/**
 * Props used to validate a day value in range pickers.
 */
export interface DayValidation<TDate> {
  /**
   * Disable specific date. @DateIOType
   * @template TDate
   * @param {TDate} day The date to test.
   * @param {string} position The date to test, 'start' or 'end'.
   * @returns {boolean} Returns `true` if the date should be disabled.
   */
  shouldDisableDate?: (day: TDate, position: TFocusPosition) => boolean;
}
