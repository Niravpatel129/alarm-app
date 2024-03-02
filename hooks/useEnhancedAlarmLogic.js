import { useNavigation } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';

const sleepMessages = [
  'Guide: Quietly read these thoughts to yourself or aloud, focusing on the sensation of relaxation. Breathe in deeply through your nose, and exhale slowly through your mouth..."',
  'Feel every muscle in your body begin to relax, starting from your toes, moving up to your head. Let go of all tension...',
  'Picture yourself in a peaceful place. It’s serene here, and you’re surrounded by tranquility. Focus on the calmness, and let it wash over you...',
];
const wakeUpMessages = [
  'Guide: Gently read these affirmations to yourself or aloud, embracing the energy of a new day. Welcome to a new day filled with opportunities and possibilities...',
  'Stretch your body slowly, feeling each part wake up with you. Embrace the sensation of becoming fully alert and alive...',
  'Think of one positive thing you aim to achieve today. Hold onto this intention as you prepare to start your day...',
];

export function useEnhancedAlarmLogic(initialTime = '01:00 AM') {
  const navigation = useNavigation();
  const [selectedTime, setSelectedTime] = useState(initialTime);
  const [showGuide, setShowGuide] = useState(true);
  const [isSleepMode, setIsSleepMode] = useState(true);
  const [alarmInProgress, setAlarmInProgress] = useState(false);
  const [messages, setMessages] = useState(sleepMessages);
  const [messageTitle, setMessageTitle] = useState('Intentional Dreaming');

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
    messageTitle,
  };
}
