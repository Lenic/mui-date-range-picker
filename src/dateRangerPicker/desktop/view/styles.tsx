import { styled } from '@mui/material/styles';
import { PickersArrowSwitcher } from '@mui/x-date-pickers/internals';

export const DesktopViewRoot = styled('div', {
  name: 'DesktopViewRoot',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})`
  display: flex;
  flexdirection: row;
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
