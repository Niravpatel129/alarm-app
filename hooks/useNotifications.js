import * as Notifications from 'expo-notifications';
import { useState } from 'react';
import { Alert } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import { useSound } from '../context/sound/SoundContext';

export function useNotifications() {
  const { playSound, stopSound } = useSound();
  const [isAlarmSet, setIsAlarmSet] = useState(false);

  const scheduleAlarm = async (alarmTime) => {
    const now = new Date();
    const timeDifference = alarmTime.getTime() - now.getTime();
    console.log('🚀  timeDifference:', timeDifference);

    if (timeDifference < 0) {
      Alert.alert('Error', 'Alarm time must be in the future.');
      return;
    }

    setIsAlarmSet(true);

    BackgroundTimer.setTimeout(async () => {
      try {
        console.log('Alarm time reached, playing sound...');
        await playSound('alarm');

        setIsAlarmSet(false);
      } catch (error) {
        console.error('Error playing sound', error);
      }
    }, timeDifference);
  };

  const stopAlarmNotifications = async () => {
    console.log('Cancelling all scheduled alarms and stopping sound...');
    stopSound('alarm');

    await Notifications.cancelAllScheduledNotificationsAsync();
    if (isAlarmSet) {
      BackgroundTimer.clearTimeout();
      setIsAlarmSet(false);
    }
  };

  return { scheduleAlarm, stopAlarmNotifications };
}
