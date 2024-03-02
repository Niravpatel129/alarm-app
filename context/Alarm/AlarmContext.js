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
  const [showGuide, setShowGuide] = useState(false);
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
    if (!selectedTime) return;
    if (!isSleepMode) return;

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
  }, [selectedTime, isSleepMode]);

  useEffect(() => {
    const checkAlarmInProgress = async () => {
      console.log('Checking alarm in progress');
      const localAlarmInProgress = await AsyncStorage.getItem('alarmInProgress');

      if (localAlarmInProgress === 'true') {
        console.log('Alarm in progress: ', localAlarmInProgress);

        setAlarmInProgress(true);
        navigation.navigate('AlarmScreen');
      }
    };

    checkAlarmInProgress();
  }, []);

  useEffect(() => {
    const dynamicSleepMessages = getDynamicSleepMessages();
    if (dynamicSleepMessages) setMessages(dynamicSleepMessages);
  }, [selectedTime, getDynamicSleepMessages]);

  const handleTimeChange = useCallback((time) => {
    setSelectedTime(time);
  }, []);

  const toggleGuide = () => {
    console.log('🚀  toggleGuide showGuide:', showGuide);

    if (!alarmInProgress && showGuide) {
      navigation.navigate('Home');
    }

    setShowGuide((prevShowGuide) => !prevShowGuide);
  };

  const startAlarm = useCallback(() => {
    console.log('🚀  start alarm selectedTime:', selectedTime);
    setAlarmInProgress(true);
    setIsSleepMode(true);
    setMessageTitle('Intentional Dreaming');
    setMessages(getDynamicSleepMessages());

    toggleGuide();

    // save the alarm in progress to local storage
    AsyncStorage.setItem('alarmInProgress', JSON.stringify(true));
    AsyncStorage.setItem('isSleepMode', JSON.stringify(true));
    AsyncStorage.setItem('selectedTime', JSON.stringify(selectedTime));

    navigation.navigate('AlarmScreen');
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

    // save the alarm in progress to local storage
    AsyncStorage.setItem('alarmInProgress', JSON.stringify(false));
    AsyncStorage.setItem('isSleepMode', JSON.stringify(false));
  }, [toggleGuide]);

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
