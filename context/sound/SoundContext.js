import { Audio } from 'expo-av';
import * as Notifications from 'expo-notifications';
import React, { createContext, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';

export const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [alarmSound, setAlarmSound] = useState(null);

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

  useEffect(() => {
    loadSounds();
    return () => {
      alarmSound?.unloadAsync();
    };
  }, []);

  const loadSounds = async () => {
    try {
      const { sound: alarm } = await Audio.Sound.createAsync(
        require('../../assets/sounds/birds2.wav'),
      );

      setAlarmSound(alarm);
    } catch (error) {
      console.log('error loading sounds', error);
    }
  };

  const playSound = async (soundType) => {
    if (soundType === 'alarm' && alarmSound) {
      await alarmSound.replayAsync();
    }
  };

  const stopSound = async (soundType) => {
    if (soundType === 'alarm' && alarmSound) {
      await alarmSound.stopAsync();
    }
  };

  return <SoundContext.Provider value={{ playSound, stopSound }}>{children}</SoundContext.Provider>;
};

export const useSound = () => {
  return React.useContext(SoundContext);
};
