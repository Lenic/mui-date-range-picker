import type { Dayjs } from 'dayjs';

import { styled } from '@mui/material/styles';
import { DAY_MARGIN, DayPicker, PickersArrowSwitcher } from '@mui/x-date-pickers/internals';

export const DesktopViewRoot = styled('div', {
  name: 'DesktopViewRoot',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})`
  display: flex;
  flex-direction: row;
`;

export const DesktopViewContainer = styled('div', {
  name: 'DesktopViewContainer',
  slot: 'Container',
  overridesResolver: (_, styles) => styles.container,
})(({ theme }) => ({
  '&:not(:last-of-type)': {
    borderRight: `2px solid ${theme.palette.divider}`,
  },
}));

export const DesktopViewArrowSwitcher = styled(PickersArrowSwitcher, {
  name: 'DesktopViewArrowSwitcher',
})`
  padding: 16px 16px 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DAY_RANGE_SIZE = 40;
const weeksContainerHeight = (DAY_RANGE_SIZE + DAY_MARGIN * 2) * 6;
export const DateRangePickerViewDesktopCalendar = styled(DayPicker<Dayjs>)`
  min-width: 312px;
  min-height: ${weeksContainerHeight};
`;
