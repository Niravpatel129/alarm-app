import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

const AlarmContext = createContext();

const safelyParseJSON = (json) => {
  try {
    return JSON.parse(json);
  } catch (e) {
    return null;
  }
};

export const AlarmProvider = ({ children }) => {
  const navigation = useNavigation();

  const [selectedTime, setSelectedTime] = useState(
    () => safelyParseJSON(AsyncStorage.getItem('selectedTime')) || '01:00 AM',
  );
  const [showGuide, setShowGuide] = useState(true);
  const [isSleepMode, setIsSleepMode] = useState(
    () => safelyParseJSON(AsyncStorage.getItem('isSleepMode')) || true,
  );
  const [alarmInProgress, setAlarmInProgress] = useState(
    () => safelyParseJSON(AsyncStorage.getItem('alarmInProgress')) || false,
  );
  const [messages, setMessages] = useState([]);
  const [messageTitle, setMessageTitle] = useState('Intentional Dreaming');

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

  const getDynamicSleepMessages = useCallback(() => {
    if (!selectedTime) return null;
    if (!isSleepMode) return null;

    const currentTime = new Date();
    const wakeUpTime = parseTime(selectedTime);
    const totalMinutesUntilWakeUp = Math.floor((wakeUpTime - currentTime) / 60000);
    const hoursUntilWakeUp = Math.floor(totalMinutesUntilWakeUp / 60);
    const minutesUntilWakeUp = totalMinutesUntilWakeUp % 60;
    let formattedCurrentTime = format(currentTime, 'hh:mm a');
    let formattedWakeUpTime = format(wakeUpTime, 'hh:mm a');

    // remove prefix 0 from hours
    if (formattedCurrentTime[0] === '0') {
      formattedCurrentTime = formattedCurrentTime.slice(1);
    }

    if (formattedWakeUpTime[0] === '0') {
      formattedWakeUpTime = formattedWakeUpTime.slice(1);
    }

    let timeString = '';
    if (hoursUntilWakeUp > 0) {
      timeString += `${hoursUntilWakeUp} hour${hoursUntilWakeUp > 1 ? 's' : ''}`;
    }
    if (minutesUntilWakeUp > 0) {
      if (timeString.length > 0) {
        timeString += ' and ';
      }
      timeString += `${minutesUntilWakeUp} minute${minutesUntilWakeUp > 1 ? 's' : ''}`;
    }

    return [
      `The time is ${formattedCurrentTime}`,
      `Alarm will ring at ${formattedWakeUpTime}`,
      `Which is in ${timeString}`,
    ];
  }, [selectedTime]);

  useEffect(() => {
    setMessages(getDynamicSleepMessages());
  }, [selectedTime, getDynamicSleepMessages]);

  useEffect(() => {
    // Save to local storage when values change
    AsyncStorage.setItem('selectedTime', JSON.stringify(selectedTime));
    AsyncStorage.setItem('isSleepMode', JSON.stringify(isSleepMode));
    AsyncStorage.setItem('alarmInProgress', JSON.stringify(alarmInProgress));
  }, [selectedTime, isSleepMode, alarmInProgress]);

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
    setMessages(getDynamicSleepMessages());
  }, [getDynamicSleepMessages]);

  const stopAlarm = useCallback(() => {
    setIsSleepMode(false);

    const wakeUpMessages = [
      "It's time to wake up. Let's seize the day!",
      'Remember to stretch and have a great morning.',
      "What's one positive thing you're looking forward to today?",
    ];

    setMessages(wakeUpMessages);
    setMessageTitle('Good Morning');
    setAlarmInProgress(false);
    toggleGuide();
  }, [toggleGuide]);

  useEffect(() => {
    if (!alarmInProgress && !showGuide) {
      console.log('Navigating to Home');
      navigation.navigate('Home');
    }
  }, [alarmInProgress, navigation, showGuide]);

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
    throw new Error('useAlarm must be used within an AlarmProvider');
  }
  return context;
};
