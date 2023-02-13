import { SxProps } from '@mui/system';
import { Theme } from '@mui/material/styles';
import { PickersDayProps } from '@mui/x-date-pickers/PickersDay';

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
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}

export type TDateRangeDayComponent = <TDate>(
  props: IDateRangeDayProps<TDate> & React.RefAttributes<HTMLButtonElement>
) => JSX.Element;
