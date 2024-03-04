import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import React, { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

const Settings = () => {
  const [soundObject, setSoundObject] = useState();

  useEffect(() => {
    const loadSounds = async () => {
      try {
        if (soundObject) {
          return;
        }

        const { sound } = await Audio.Sound.createAsync(require('../../assets/sounds/birds2.wav'));

        setSoundObject(sound);
      } catch (error) {
        console.error('Error loading sounds', error);
      }
    };

    const requestPermissions = async () => {
      try {
        // get background sound permissions for iOS
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          allowsRecordingIOS: false,
          staysActiveInBackground: true,
          interruptionModeIOS: 'DoNotMix',
          shouldDuckAndroid: true,
          interruptionModeAndroid: 'DoNotMix',
          playThroughEarpieceAndroid: false,
        });

        if (Platform.OS !== 'web') {
          const { status: existingStatus } = await Notification.getPermissionsAsync();
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

    loadSounds();
    requestPermissions();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Page</Text>
      <TouchableOpacity
        onPress={() => {
          // wait 5 seconds before playing the sound
          soundObject.setIsLoopingAsync(true);
          setTimeout(() => {
            soundObject.replayAsync();
          }, 5000);
        }}
        style={{
          backgroundColor: 'blue',
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        <Text style={{ color: 'white' }}>Play Sound</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          soundObject.stopAsync();
        }}
        style={{
          backgroundColor: 'red',
          padding: 10,
          borderRadius: 5,
          marginTop: 20,
        }}
      >
        <Text style={{ color: 'white' }}>Stop Sound</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;
