import { useNavigation } from '@react-navigation/native';
import { differenceInHours, format } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

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

const parseTime = (timeString) => {
  if (!timeString) return new Date();

  const [time, modifier] = timeString.split(' ');
  let [hours, minutes] = time.split(':');
  hours = parseInt(hours, 10);
  minutes = parseInt(minutes, 10);

  // Convert 12 AM to 00 hours and 12 PM to 12 hours
  if (modifier === 'PM' && hours !== 12) {
    hours += 12;
  } else if (modifier === 'AM' && hours === 12) {
    hours = 0;
  }

  let wakeUpTime = new Date();
  wakeUpTime.setHours(hours, minutes, 0, 0);

  // Ensure wakeUpTime is in the future
  const currentTime = new Date();
  if (wakeUpTime <= currentTime) {
    wakeUpTime = new Date(wakeUpTime.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours in milliseconds
  }

  return wakeUpTime;
};

export function useEnhancedAlarmLogic(initialTime = '01:00 AM') {
  const navigation = useNavigation();
  const [selectedTime, setSelectedTime] = useState();
  console.log('🚀  selectedTime:', selectedTime);
  const [showGuide, setShowGuide] = useState(true);
  const [isSleepMode, setIsSleepMode] = useState(true);
  const [alarmInProgress, setAlarmInProgress] = useState(false);
  const [messages, setMessages] = useState(sleepMessages);
  const [messageTitle, setMessageTitle] = useState('Intentional Dreaming');

  const getDynamicSleepMessages = () => {
    const currentTime = new Date();
    const wakeUpTime = parseTime(selectedTime);
    console.log('🚀  selectedTime:', selectedTime); //Example: 05:09 AM
    console.log('🚀  wakeUpTime:', wakeUpTime); //Example: Sun Mar 03 2024 06:09:00 GMT-0500 (Eastern Standard Time)
    const hoursUntilWakeUp = differenceInHours(wakeUpTime, currentTime);
    const formattedCurrentTime = format(currentTime, 'hh:mm a');
    const formattedWakeUpTime = format(wakeUpTime, 'hh:mm a');

    return [
      `It's currently ${formattedCurrentTime}. You are ready for a restful sleep.`,
      `You will wake up at ${formattedWakeUpTime}, feeling refreshed and energetic.`,
      `You have ${hoursUntilWakeUp} hours until it's time to start your day. Enjoy your rest.`,
    ];
  };

  useEffect(() => {
    setMessages(getDynamicSleepMessages());
  }, [selectedTime, alarmInProgress]);

  const handleTimeChange = useCallback((time) => {
    setSelectedTime(time);
  }, []);

  const toggleGuide = useCallback(() => {
    setShowGuide((prevShowGuide) => !prevShowGuide);
  }, []);

  const startAlarm = useCallback((alarmTime) => {
    console.log('🚀  alarmTime:', alarmTime);
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
