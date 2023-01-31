import type { FC } from 'react';

import type { TRangeDays } from './context';

import dayjs from 'dayjs';
import { useState } from 'react';

import { MonthView } from './month';
import { LeftMonthProvider, SelectedDaysProvider } from './context';

export const DateRangePickerPanel: FC = () => {
  const [leftMonth, setLeftMonth] = useState(() => dayjs());
  const [selectedDays, setSelectedDays] = useState(() => [null, null] as TRangeDays);

  return (
    <LeftMonthProvider value={leftMonth} setValue={setLeftMonth}>
      <SelectedDaysProvider value={selectedDays} setValue={setSelectedDays}>
        <MonthView />
      </SelectedDaysProvider>
    </LeftMonthProvider>
  );
};
