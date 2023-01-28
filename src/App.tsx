import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import { Mine } from './mine';
import { DateRangePicker } from './dateRangerPicker';

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div>abc</div>
      <Mine />
      <DateRangePicker />
    </LocalizationProvider>
  );
}

export default App;
