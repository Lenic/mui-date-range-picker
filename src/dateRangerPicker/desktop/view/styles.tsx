import type { Dayjs } from 'dayjs';

import { styled } from '@mui/material/styles';
import { DAY_MARGIN, DayPicker, PickersArrowSwitcher } from '@mui/x-date-pickers/internals';

export const Wrapper = styled('div', {
  name: 'Wrapper',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})`
  display: flex;
  flex-direction: row;
`;

export const Container = styled('div', {
  name: 'Container',
  slot: 'Container',
  overridesResolver: (_, styles) => styles.container,
})(({ theme }) => ({
  '&:not(:last-of-type)': {
    borderRight: `2px solid ${theme.palette.divider}`,
  },
}));

export const Switcher = styled(PickersArrowSwitcher, { name: 'Switcher' })`
  padding: 16px 16px 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const DAY_RANGE_SIZE = 40;
const weeksContainerHeight = (DAY_RANGE_SIZE + DAY_MARGIN * 2) * 6;
export const Calendar = styled(DayPicker<Dayjs>)`
  min-width: 312px;
  min-height: ${weeksContainerHeight};
`;
