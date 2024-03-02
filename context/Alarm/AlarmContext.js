import { useNavigation } from '@react-navigation/native';
import { differenceInHours, format } from 'date-fns';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AlarmContext = createContext();

export function useAlarm() {
  return useContext(AlarmContext);
}

const parseTime = (timeString) => {
  if (!timeString) return new Date();

  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  let wakeUpTime = new Date();
  wakeUpTime.setHours(hours, minutes, 0, 0);

  const currentTime = new Date();
  if (wakeUpTime <= currentTime) {
    wakeUpTime.setDate(wakeUpTime.getDate() + 1);
  }

  return wakeUpTime;
};

export const AlarmProvider = ({ children }) => {
  const navigation = useNavigation();
  const [selectedTime, setSelectedTime] = useState('01:00 AM');
  const [showGuide, setShowGuide] = useState(true);
  const [isSleepMode, setIsSleepMode] = useState(true);
  const [alarmInProgress, setAlarmInProgress] = useState(false);
  const [messages, setMessages] = useState([]);
  const [messageTitle, setMessageTitle] = useState('Intentional Dreaming');

  const sleepMessages = [
    "It's currently [current time]. You are ready for a restful sleep.",
    'You will wake up at [wake-up time], feeling refreshed and energetic.',
    "You have [X hours] until it's time to start your day. Enjoy your rest.",
  ];

  const wakeUpMessages = [
    "It's [wake-up time]. Rise and shine, ready to embrace the day with positivity.",
    "Take a moment to stretch and awaken your body, preparing for today's adventures.",
    'Consider one goal for today. Let this intention guide you as you begin.',
  ];

  const getDynamicSleepMessages = useCallback(() => {
    const currentTime = new Date();
    const wakeUpTime = parseTime(selectedTime);
    const hoursUntilWakeUp = differenceInHours(wakeUpTime, currentTime);
    const formattedCurrentTime = format(currentTime, 'hh:mm a');
    const formattedWakeUpTime = format(wakeUpTime, 'hh:mm a');

    return [
      `It's currently ${formattedCurrentTime}. You are ready for a restful sleep.`,
      `You will wake up at ${formattedWakeUpTime}, feeling refreshed and energetic.`,
      `You have ${hoursUntilWakeUp} hours until it's time to start your day. Enjoy your rest.`,
    ];
  }, [selectedTime]);

  useEffect(() => {
    setMessages(getDynamicSleepMessages());
  }, [selectedTime, alarmInProgress, getDynamicSleepMessages]);

  const handleTimeChange = useCallback((time) => {
    setSelectedTime(time);
  }, []);

  const toggleGuide = useCallback(() => {
    setShowGuide((prevShowGuide) => !prevShowGuide);
  }, []);

  const startAlarm = useCallback(() => {
    setAlarmInProgress(true);
    setIsSleepMode(true);
    setMessageTitle('Intentional Dreaming');
    setMessages(sleepMessages);
  }, []);

  const stopAlarm = useCallback(() => {
    setMessages(wakeUpMessages);
    setMessageTitle('Intentional Awakening');
    setAlarmInProgress(false);
    toggleGuide();
  }, [toggleGuide]);

  useEffect(() => {
    if (alarmInProgress) {
      navigation.navigate('AlarmScreen');
    }
  }, [alarmInProgress, navigation]);

  return (
    <AlarmContext.Provider
      value={{
        selectedTime,
        showGuide,
        isSleepMode,
        messages,
        alarmInProgress,
        handleTimeChange,
        toggleGuide,
        startAlarm,
        stopAlarm,
        setAlarmInProgress,
        messageTitle,
      }}
    >
      {children}
    </AlarmContext.Provider>
  );
};

export const useAlarmContext = () => {
  const context = useContext(AlarmContext);
  if (!context) {
    throw new Error('useAlarmContext must be used within an AlarmProvider');
  }
  return context;
};
