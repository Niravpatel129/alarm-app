import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';
import { VolumeManager } from 'react-native-volume-manager';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    const requestPermissions = async () => {
      const { volume } = await VolumeManager.getVolume();
      console.log('🚀  volume:', volume);

      try {
        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('alarm-channel', {
            name: 'Alarm channel',
            importance: Notifications.AndroidImportance.MAX,
            sound: 'birds.wav',
          });
        }

        //
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
        console.log('Error getting a push token', error);
      }
    };

    requestPermissions();
  }, []);

  async function scheduleAlarm() {
    const schedulingOptions = {
      content: {
        title: 'Alarm',
        body: 'Your alarm is ringing!',
        vibrate: false,
        sound: 'birds.wav',
      },
      trigger: {
        seconds: 2,
        channelId: 'alarm-channel',
      },
    };

    console.log('Scheduling alarm...');

    await Notifications.scheduleNotificationAsync(schedulingOptions);
    console.log('Alarm set for 2 seconds from now.');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Simple Alarm App</Text>
      <Button title='Set Alarm for 2 Seconds' onPress={scheduleAlarm} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
