import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useEffect } from 'react';

function usePlayAudioClip(audioUri) {
  useEffect(() => {
    let playbackObject;
    let intervalId;

    async function setupPlayer() {
      console.log('🚀  audioUri:', audioUri);
      const number = await AsyncStorage.getItem('interval');
      console.log('🚀  number:', number);

      // Create and load the sound
      playbackObject = new Audio.Sound();
      try {
        await playbackObject.loadAsync(require('../assets/sounds/bubble.mp3'), {}, true);
      } catch (error) {
        console.error('Error loading sound:', error);
        return;
      }

      // Start playing the audio at a set interval
      intervalId = setInterval(async () => {
        await playbackObject.setPositionAsync(0); // Seek to the beginning of the track
        await playbackObject.playAsync(); // Play the track
      }, Number(number) || 10000);
    }

    setupPlayer();

    // Cleanup function to stop the playback and unload the player on component unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
      playbackObject && playbackObject.unloadAsync();
    };
  }, [audioUri]); // Dependency array to re-run the effect if the audioUri changes
}

export default usePlayAudioClip;
