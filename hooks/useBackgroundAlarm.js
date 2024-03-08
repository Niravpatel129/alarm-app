import { useEffect } from 'react';
import TrackPlayer, { Capability } from 'react-native-track-player';

// Custom hook to setup and play the audio clip
function usePlayAudioClip(audioUri) {
  useEffect(() => {
    // Setup the player
    async function setupPlayer() {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.add({
        id: 'trackId',
        url: require('../assets/sounds/bubble.mp3'),
        title: 'Track Title',
        artist: 'Track Artist',
      });

      // Define player capabilities
      await TrackPlayer.updateOptions({
        capabilities: [Capability.Play, Capability.Pause],
      });

      // Start playing the audio every 3 seconds
      const intervalId = setInterval(() => {
        TrackPlayer.seekTo(0); // Seek to the beginning of the track
        TrackPlayer.play(); // Play the track
      }, 3000); // Interval set to 3 seconds

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
