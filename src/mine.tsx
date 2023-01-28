import type { FC } from "react";
import type { Dayjs } from "dayjs";

import { useState } from "react";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

export const Mine: FC = () => {
  const [value, setValue] = useState<Dayjs | null>(null);

  return (
    <DatePicker
      label="Basic example"
      value={value}
      onChange={(newValue) => {
        setValue(newValue);
      }}
      renderInput={(params) => <TextField {...params} />}
    />
  );
};
