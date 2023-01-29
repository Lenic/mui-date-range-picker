import type { Dayjs } from 'dayjs';
import type { Dispatch, FC, SetStateAction } from 'react';

import { createContext, useContext, useMemo } from 'react';

export type TSelectedDays = [Dayjs | null, Dayjs | null];

export type TSelectedDaysContext = {
  selectedDays: TSelectedDays;
  setSelectedDays: Dispatch<SetStateAction<TSelectedDays>>;
};

export type TSelectedDaysProvider = {
  value: TSelectedDays;
  setValue: Dispatch<SetStateAction<TSelectedDays>>;
  children?: React.ReactNode;
};

const selectedDaysContext = createContext<TSelectedDaysContext>({} as TSelectedDaysContext);

export const useSelectedDays = () => useContext(selectedDaysContext);

const { Provider } = selectedDaysContext;
export const SelectedDaysProvider: FC<TSelectedDaysProvider> = (props) => {
  const { children, value, setValue } = props;
  const providerValue: TSelectedDaysContext = useMemo(
    () => ({ selectedDays: value, setSelectedDays: setValue }),
    [value, setValue]
  );

  return <Provider value={providerValue}>{children}</Provider>;
};
