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
    // Optionally, trigger the alarm in progress state to handle redirection or other actions.
    setAlarmInProgress(true);
  }, []);

  // Auto-redirect or perform other actions when alarm is in progress
  useEffect(() => {
    if (alarmInProgress) {
      // Example: automatically navigate to a specific screen when alarm is in progress
      navigation.navigate('AlarmScreen');

      // After handling, reset the alarm progress state as needed
      // setAlarmInProgress(false); // Uncomment if you want to reset after navigation
    }
  }, [alarmInProgress, navigation]);

  return {
    selectedTime,
    showGuide,
    isSleepMode,
    messages,
    alarmInProgress, // Expose alarmInProgress state if needed elsewhere
    handleTimeChange,
    toggleGuide,
    // Provide a method to manually control the alarm progress state if needed
    setAlarmInProgress,
  };
}
