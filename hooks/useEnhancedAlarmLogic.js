import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

export function useEnhancedAlarmLogic(initialTime = '01:00 AM') {
  const navigation = useNavigation();
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [showGuide, setShowGuide] = useState(true);
  const [isSleepMode, setIsSleepMode] = useState(true);
  const [alarmInProgress, setAlarmInProgress] = useState(false);
  const sleepMessages = ['Breathe in...', 'Breathe out...', 'Focus on your breath...'];
  const wakeUpMessages = ['Welcome back...', 'Stretch your body...', 'Prepare for the day...'];
  const [messages, setMessages] = useState(sleepMessages);

  const handleTimeChange = useCallback((time) => {
    setSelectedTime(time);
  }, []);

  const toggleGuide = useCallback(() => {
    setShowGuide((prevShowGuide) => !prevShowGuide);
    setIsSleepMode((prevIsSleepMode) => {
      const newMessages = prevIsSleepMode ? wakeUpMessages : sleepMessages;
      setMessages(newMessages);
      return !prevIsSleepMode;
    });
    setAlarmInProgress(false);
  }, []);

  const startAlarm = useCallback(() => {
    setAlarmInProgress(true);
  }, []);

  const stopAlarm = useCallback(() => {
    setAlarmInProgress(false);
  }, []);

  useEffect(() => {
    if (alarmInProgress) {
      navigation.navigate('AlarmScreen');
    }
  }, [alarmInProgress, navigation]);

  return {
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
  };
}
