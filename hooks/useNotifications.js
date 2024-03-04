import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Alert, Platform } from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

export function useNotifications() {
  const soundObject = useRef(new Audio.Sound());
  const [isAlarmSet, setIsAlarmSet] = useState(false);

  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const requestPermissions = async () => {
      try {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('alarm-channel', {
            name: 'Alarm channel',
            importance: Notifications.AndroidImportance.MAX,
            sound: 'default',
          });
        }

        if (Platform.OS !== 'web') {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync({
              ios: {
                allowAlert: true,
                allowSound: true,
                allowBadge: true,
              },
            });
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            Alert.alert('Failed to get push token for push notification!');
            return;
          }
        }
      } catch (error) {
        console.error('Error setting up notifications', error);
      }
    };

    const configureAudioSession = async () => {
      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          interruptionModeIOS: 'DoNotMix',
          shouldDuckAndroid: true,
          interruptionModeAndroid: 'DoNotMix',
          playThroughEarpieceAndroid: false,
        });
      } catch (e) {
        console.error('Error configuring audio session', e);
      }
    };

    configureAudioSession();
    requestPermissions();
  }, []);

  const scheduleAlarm = async (alarmTime) => {
    await soundObject.current.loadAsync(require('../assets/sounds/birds2.wav'));

    const now = new Date();
    const timeDifference = alarmTime.getTime() - now.getTime();
    if (timeDifference < 0) {
      Alert.alert('Error', 'Alarm time must be in the future.');
      return;
    }

    setIsAlarmSet(true);

    BackgroundTimer.setTimeout(async () => {
      try {
        console.log('Alarm time reached, playing sound...');
        await soundObject.current.setIsLoopingAsync(true);
        await soundObject.current.playAsync();
        setIsAlarmSet(false);
      } catch (error) {
        console.error('Error playing sound', error);
      }
    }, timeDifference);
  };

  const stopAlarmNotifications = async () => {
    console.log('Cancelling all scheduled alarms and stopping sound...');
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (isAlarmSet) {
      BackgroundTimer.clearTimeout(); // Stop the background timer
      setIsAlarmSet(false);
    }
    try {
      await soundObject.current.stopAsync();
      await soundObject.current.unloadAsync();
    } catch (error) {
      console.error('Error stopping sound', error);
    }
  };

  return { scheduleAlarm, stopAlarmNotifications };
}
