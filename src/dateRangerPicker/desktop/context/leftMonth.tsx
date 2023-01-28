import type { Dayjs } from 'dayjs';
import type { Dispatch, FC, SetStateAction } from 'react';

import { createContext, useContext, useMemo } from 'react';

export type TCurrentMonthContext = {
  leftMonth: Dayjs;
  setLeftMonth: Dispatch<SetStateAction<Dayjs>>;
};

export type TLeftMonthProvider = {
  value: Dayjs;
  setValue: Dispatch<SetStateAction<Dayjs>>;
  children?: React.ReactNode;
};

const leftMonthContext = createContext<TCurrentMonthContext>({} as TCurrentMonthContext);

export const useLeftMonth = () => useContext(leftMonthContext);

const { Provider } = leftMonthContext;
export const LeftMonthProvider: FC<TLeftMonthProvider> = (props) => {
  const { children, value, setValue } = props;
  const providerValue: TCurrentMonthContext = useMemo(
    () => ({ leftMonth: value, setLeftMonth: setValue }),
    [value, setValue]
  );

  return <Provider value={providerValue}>{children}</Provider>;
};
