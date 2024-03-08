import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import TrackPlayer, { Capability } from 'react-native-track-player';

// Custom hook to setup and play the audio clip
function usePlayAudioClip(audioUri) {
  useEffect(() => {
    const setupListener = async () => {
      TrackPlayer.addEventListener('remote-play', () => {
        TrackPlayer.play();
      });
      TrackPlayer.addEventListener('remote-pause', () => {
        TrackPlayer.pause();
      });
    };

    setupListener();

    // Setup the player
    async function setupPlayer() {
      console.log('🚀  audioUri:', audioUri);
      const number = await AsyncStorage.getItem('interval');
      console.log('🚀  number:', number);

      await TrackPlayer.setupPlayer();
      await TrackPlayer.add({
        id: 'trackId',
        url: require('../assets/sounds/bubble.mp3'),
        title: '',
        artist: '',
      });

      // Define player capabilities
      await TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause],
      });

      // Start playing the audio every 3 seconds
      const intervalId = setInterval(async () => {
        TrackPlayer.seekTo(0); // Seek to the beginning of the track
        TrackPlayer.play(); // Play the track
      }, Number(number) || 10000);

      // Cleanup function to stop the playback and destroy the player on component unmount
      return () => {
        clearInterval(intervalId);
        TrackPlayer.stop();
        TrackPlayer.destroy();
      };
    }

    setupPlayer();
  }, [audioUri]); // Dependency array to re-run the effect if the audioUri changes
}

export default usePlayAudioClip;
