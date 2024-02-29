import * as Notifications from 'expo-notifications';
import React, { useEffect } from 'react';
import { Button, Platform, StyleSheet, Text, View } from 'react-native';

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
      try {
        if (Platform.OS !== 'web') {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
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
        sound: 'alarm.mp3',
        vibrate: [0, 500, 200, 500],
      },
      trigger: {
        seconds: 10,
      },
    };

    console.log('Scheduling alarm...');
    await Notifications.scheduleNotificationAsync(schedulingOptions);
    console.log('Alarm set for 10 seconds from now.');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Simple Alarm App</Text>
      <Button title='Set Alarm for 10 Seconds' onPress={scheduleAlarm} />
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
