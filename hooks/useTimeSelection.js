import { useEffect, useRef, useState } from 'react';

const useTimeSelection = (onTimeChange) => {
  const hourListRef = useRef(null);
  const minuteListRef = useRef(null);
  const periodListRef = useRef(null);

  const now = new Date();
  now.setMinutes(now.getMinutes() + 1); // Add one minute to ensure we're in the future

  // Keep this function as is for formatting hours without padding "0"
  const formatHour = (hour) => `${hour % 12 === 0 ? 12 : hour % 12}`;
  const initialHour = formatHour(now.getHours());
  // Keep the minute padding with "0" for better readability
  const initialMinute = `${now.getMinutes()}`.padStart(2, '0');
  const initialPeriod = now.getHours() < 12 ? 'AM' : 'PM';

  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  // Generating hours without leading zeros
  const hours = Array.from({ length: 12 }, (_, i) => formatHour(i + 1));
  // Generating minutes with leading zeros for consistency and readability
  const minutes = Array.from({ length: 60 }, (_, i) => `${i}`.padStart(2, '0'));
  const periods = ['AM', 'PM'];

  useEffect(() => {
    const hourIndex = hours.findIndex((item) => item === initialHour);
    const minuteIndex = minutes.findIndex((item) => item === initialMinute);
    const periodIndex = periods.findIndex((item) => item === initialPeriod);

    hourListRef.current?.scrollToIndex({ index: hourIndex, animated: false });
    minuteListRef.current?.scrollToIndex({ index: minuteIndex, animated: false });
    periodListRef.current?.scrollToIndex({ index: periodIndex, animated: false });

    onTimeChange(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);
  }, []);

  useEffect(() => {
    onTimeChange(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);
  }, [selectedHour, selectedMinute, selectedPeriod]);

  return {
    hourListRef,
    minuteListRef,
    periodListRef,
    selectedHour,
    setSelectedHour,
    selectedMinute,
    setSelectedMinute,
    selectedPeriod,
    setSelectedPeriod,
    hours,
    minutes,
    periods,
  };
};

export default useTimeSelection;
