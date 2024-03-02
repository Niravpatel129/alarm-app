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

  const scheduleAlarm = async () => {
    const schedulingOptions = {
      content: {
        title: 'Alarm',
        body: 'Your alarm is ringing!',
        sound: 'birds2.wav',
      },
      trigger: {
        seconds: 2,
        channelId: 'alarm-channel',
      },
    };

    console.log('Scheduling alarm...');
    await Notifications.scheduleNotificationAsync(schedulingOptions);
  };

  return { scheduleAlarm };
}
