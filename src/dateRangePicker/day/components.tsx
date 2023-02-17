import { alpha, styled } from '@mui/material/styles';
import { DAY_MARGIN } from '@mui/x-date-pickers/internals';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';

const endBorderStyle = { borderTopRightRadius: '50%', borderBottomRightRadius: '50%' };
const startBorderStyle = { borderTopLeftRadius: '50%', borderBottomLeftRadius: '50%' };

export const DayRenderRoot = styled('div')(({ theme }) => ({
  '&:first-of-type .preselected': {
    ...startBorderStyle,
    borderLeftColor: theme.palette.divider,
  },
  '&:last-of-type .preselected': {
    ...endBorderStyle,
    borderRightColor: theme.palette.divider,
  },
  '&.highlight': {
    borderRadius: 0,
    color: theme.palette.primary.contrastText,
    backgroundColor: alpha(theme.palette.primary.light, 0.6),
    '&:first-of-type': startBorderStyle,
    '&:last-of-type': endBorderStyle,
  },
  '&.highlight-start': {
    ...startBorderStyle,
    paddingLeft: 0,
    marginLeft: DAY_MARGIN / 2,
  },
  '&.highlight-end': {
    ...endBorderStyle,
    paddingRight: 0,
    marginRight: DAY_MARGIN / 2,
  },
  '&>.day-container>.day-core.Mui-selected:hover': {
    backgroundColor: '#1565c0 !important',
  },
}));

export const DayRenderContainer = styled('div')(({ theme }) => ({
  border: '2px solid transparent',
  '&.preselected': {
    borderRadius: 0,
    border: `2px dashed ${theme.palette.divider}`,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    '&.preselected-start': {
      borderLeftColor: theme.palette.divider,
      ...startBorderStyle,
    },
    '&.preselected-end': {
      borderRightColor: theme.palette.divider,
      ...endBorderStyle,
    },
  },
}));

export const DayRenderCore = styled(PickersDay)(({ theme }) => ({
  transform: 'scale(1.1)',
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04) !important',
  },
  '& > *': {
    transform: 'scale(0.9)',
  },
  '&.not-selected': {
    backgroundColor: 'transparent',
  },
  '&.day-outside': {
    '&:hover': {
      border: `1px solid ${theme.palette.grey[500]}`,
    },
  },
  '&.day-inside': {
    color: theme.palette.getContrastText(alpha(theme.palette.primary.light, 0.6)),
  },
})) as unknown as <TDate>(props: PickersDayProps<TDate>) => JSX.Element;
