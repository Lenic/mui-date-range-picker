import type { FC } from 'react';

import dayjs from 'dayjs';
import { useState } from 'react';

import { DesktopView } from './view';
import { LeftMonthProvider } from './context';

export const DateRangePicker: FC = () => {
  const [leftMonth, setLeftMonth] = useState(() => dayjs());

  return (
    <LeftMonthProvider value={leftMonth} setValue={setLeftMonth}>
      <DesktopView />
    </LeftMonthProvider>
  );
};
