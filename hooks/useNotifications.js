import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { Platform } from 'react-native';

export function useNotifications() {
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });

    const requestPermissions = async () => {
      try {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('alarm-channel', {
            name: 'Alarm channel',
            importance: Notifications.AndroidImportance.MAX,
            sound: 'birds2.wav', // Make sure this file exists in your android app resources
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
            alert('Failed to get push token for push notification!');
            return;
          }
        }
      } catch (error) {
        console.error('Error setting up notifications', error);
      }
    };

    requestPermissions();
  }, []);

  const scheduleAlarm = async (alarmTime) => {
    const now = new Date();
    const timeDifference = alarmTime.getTime() - now.getTime();
    const secondsUntilAlarm = Math.round(timeDifference / 1000);

    const numberOfNotifications = 10;
    const notificationInterval = 10;

    for (let i = 0; i < numberOfNotifications; i++) {
      const schedulingOptions = {
        content: {
          title: 'Alarm',
          body: 'Your alarm is ringing!',
          sound: 'birds2.wav', // Ensure this is a repeating sound or use multiple notifications
        },
        trigger: {
          seconds:
            secondsUntilAlarm > 0
              ? secondsUntilAlarm + i * notificationInterval
              : 1 + i * notificationInterval, // Ensure there's a delay
          channelId: 'alarm-channel', // For Android 8.0 and above
        },
      };

      console.log(`Scheduling notification #${i + 1}`);
      await Notifications.scheduleNotificationAsync(schedulingOptions);
    }
  };

  const stopAlarmNotifications = async () => {
    console.log('Cancelling all scheduled alarms...');
    await Notifications.cancelAllScheduledNotificationsAsync();
  };

  return { scheduleAlarm, stopAlarmNotifications };
}
