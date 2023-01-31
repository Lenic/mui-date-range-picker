import type { Dayjs } from 'dayjs';
import type { Dispatch, FC, SetStateAction } from 'react';

import { createContext, useContext, useMemo } from 'react';

export type TRangeDays = [Dayjs | null, Dayjs | null];

export type TRangeDaysContext = {
  selectedDays: TRangeDays;
  setSelectedDays: Dispatch<SetStateAction<TRangeDays>>;
};

export type TRangeDaysProvider = {
  value: TRangeDays;
  setValue: Dispatch<SetStateAction<TRangeDays>>;
  children?: React.ReactNode;
};

const selectedDaysContext = createContext<TRangeDaysContext>({} as TRangeDaysContext);

export const useSelectedDays = () => useContext(selectedDaysContext);

const { Provider } = selectedDaysContext;
export const SelectedDaysProvider: FC<TRangeDaysProvider> = (props) => {
  const { children, value, setValue } = props;
  const providerValue: TRangeDaysContext = useMemo(
    () => ({ selectedDays: value, setSelectedDays: setValue }),
    [value, setValue]
  );

  return <Provider value={providerValue}>{children}</Provider>;
};
