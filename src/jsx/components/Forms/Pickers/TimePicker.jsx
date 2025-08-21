import React, { useState } from 'react';
import 'react-clock/dist/Clock.css';
import TimePickerPicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';

function TimePicker() {
  const [value, onChange] = useState(new Date());

  return (
    <div>
      <TimePickerPicker onChange={onChange} value={value} />
    </div>
  );
}

function CurrentTimePicker() {
  const [value2, onChange2] = useState('10:00');
  return (
    <>
      <TimePickerPicker onChange={onChange2} value={value2} />
    </>
  );
}
export { CurrentTimePicker };
export default TimePicker;
