import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import type { Dayjs } from 'dayjs';
import type { DateRange } from './original/DateRangePicker';

import { Mine } from './mine';
import { DateRangePicker as DPicker } from './dateRangerPicker';
import { DateRangePicker } from './original/DateRangePicker';

const DateRangePickerContainer = styled('div', { name: 'DateRangePickerContainer' })`
  display: flex;
`;

function App() {
  const [value, setValue] = useState<DateRange<Dayjs>>([null, null]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>abc</div>
      <Mine />
      <DPicker />
      <DateRangePickerContainer>
        <DateRangePicker
          value={value}
          onChange={setValue}
          renderInput={(startProps, endProps) => (
            <>
              <TextField {...startProps} />
              <Box sx={{ mx: 2 }}> to </Box>
              <TextField {...endProps} autoComplete="off" />
            </>
          )}
        />
      </DateRangePickerContainer>
    </LocalizationProvider>
  );
}

export default App;
