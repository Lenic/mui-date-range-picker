import type { FC } from 'react';
import type { Dayjs } from 'dayjs';

import { useCallback, useMemo } from 'react';
import { useUtils } from '@mui/x-date-pickers/internals';

import { useLeftMonth } from '../context';

import { DesktopViewArrowSwitcher, DesktopViewContainer, DesktopViewRoot } from './styles';

export type TDesktopViewProps = {};

export const DesktopView: FC<TDesktopViewProps> = () => {
  const { leftMonth, setLeftMonth } = useLeftMonth();
  const handleSelectNextMonth = useCallback(() => setLeftMonth((cur) => cur.add(1, 'month')), [setLeftMonth]);
  const handleSelectPreviousMonth = useCallback(() => setLeftMonth((cur) => cur.subtract(1, 'month')), [setLeftMonth]);

  const utils = useUtils<Dayjs>();
  const months = useMemo(
    () => [utils.format(leftMonth, 'monthAndYear'), utils.format(leftMonth.add(1, 'month'), 'monthAndYear')],
    [leftMonth, utils]
  );

  return (
    <DesktopViewRoot>
      <DesktopViewContainer>
        <DesktopViewArrowSwitcher
          onLeftClick={handleSelectPreviousMonth}
          onRightClick={handleSelectNextMonth}
          isRightHidden
          isLeftDisabled={false}
          isRightDisabled={false}
          leftArrowButtonText={'前一个月'}
          rightArrowButtonText={'后一个月'}
        >
          {months[0]}
        </DesktopViewArrowSwitcher>
      </DesktopViewContainer>
      <DesktopViewContainer>
        <DesktopViewArrowSwitcher
          onLeftClick={handleSelectPreviousMonth}
          onRightClick={handleSelectNextMonth}
          isLeftHidden
          isLeftDisabled={false}
          isRightDisabled={false}
          leftArrowButtonText={'前一个月'}
          rightArrowButtonText={'后一个月'}
        >
          {months[1]}
        </DesktopViewArrowSwitcher>
      </DesktopViewContainer>
    </DesktopViewRoot>
  );
};
