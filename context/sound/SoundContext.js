import { Audio } from 'expo-av';
import React, { createContext, useEffect, useState } from 'react';

export const SoundContext = createContext();

export const SoundProvider = ({ children }) => {
  const [alarmSound, setAlarmSound] = useState(null);

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

      // set category to alarm so sound plays when app is in the background
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        allowsRecordingIOS: false,
        staysActiveInBackground: true,
        interruptionModeIOS: 'DoNotMix',
        shouldDuckAndroid: true,
        interruptionModeAndroid: 'DoNotMix',
        playThroughEarpieceAndroid: false,
        allowsBackgroundPlayback: true,
      });

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
