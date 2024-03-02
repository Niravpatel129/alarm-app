import { useEffect, useRef, useState } from 'react';

const useTimeSelection = (onTimeChange) => {
  const hourListRef = useRef(null);
  const minuteListRef = useRef(null);
  const periodListRef = useRef(null);

  const now = new Date();
  now.setMinutes(now.getMinutes() + 1); // Add one minute to ensure we're in the future

  const formatHour = (hour) => `${hour % 12 === 0 ? 12 : hour % 12}`;
  const initialHour = formatHour(now.getHours());
  const initialMinute = `${now.getMinutes()}`;
  const initialPeriod = now.getHours() < 12 ? 'AM' : 'PM';

  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  const hours = Array.from({ length: 12 }, (_, i) => formatHour(i + 1));
  const minutes = Array.from({ length: 60 }, (_, i) => i.toString());
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
