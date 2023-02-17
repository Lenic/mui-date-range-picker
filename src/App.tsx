import type { Dayjs } from 'dayjs';
import type { DateRange } from './dateRangePicker';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import { DateRangePicker } from './dateRangePicker';

const DateRangePickerContainer = styled('div', { name: 'DateRangePickerContainer' })`
  display: flex;
`;

function App() {
  const [value, setValue] = useState<DateRange<Dayjs>>([null, null]);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>abc</div>
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
