import { Audio } from 'expo-av';
import BackgroundService from 'react-native-background-actions';
import TrackPlayer, { Capability } from 'react-native-track-player';
import VolumeManager from 'react-native-volume-manager'; // Import for volume control

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

let backgroundSound = null;
let silentSound = null;
let originalVolume = 0; // Variable to store the original volume

const setupTrackPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      stopWithApp: false,
      capabilities: [Capability.Play, Capability.Pause],
      playInBackground: true,
      pauseInBackground: true,
    });
  } catch (error) {
    console.log('Error setting up track player', error);
  }
};

const preloadAudio = async () => {
  try {
    if (!silentSound) {
      const silent = await Audio.Sound.createAsync(require('../assets/sounds/silent.mp3'), {
        shouldPlay: false,
        isLooping: true,
      });
      silentSound = silent.sound;
      console.log('silentSound loaded');
    }

    if (!backgroundSound) {
      const background = await Audio.Sound.createAsync(require('../assets/sounds/birds2.wav'), {
        shouldPlay: false,
        isLooping: true,
      });
      backgroundSound = background.sound;
      console.log('backgroundSound loaded');
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (e) {
    console.log(e);
  }
};

const playSilentClipContinuously = async () => {
  try {
    if (!silentSound) {
      await preloadAudio();
    }
    if (!(await silentSound.getStatusAsync()).isPlaying) {
      await silentSound.setPositionAsync(0);
      await silentSound.playAsync();
    }
  } catch (e) {
    console.log(e);
  }
};

const saveOriginalVolume = async () => {
  try {
    if (VolumeManager) { // Check if VolumeManager exists
      originalVolume = await VolumeManager.getVolume(); // Save the original volume level
    } else {
      originalVolume = 1; // Default volume if VolumeManager is not available
    }
  } catch (e) {
    originalVolume = 1; // Default volume on error
    console.log(e);
  }
};

const adjustVolumeGradually = async (targetVolume, duration = 5000) => {
  if (!VolumeManager) return; // Early return if VolumeManager does not exist

  await saveOriginalVolume(); // Make sure to save the original volume before adjusting

  let steps = 10; // Define the number of steps to reach the target volume
  let stepDuration = duration / steps;
  let volumeIncrement = (targetVolume - originalVolume) / steps;

  for (let i = 0; i <= steps; i++) {
    let newVolume = originalVolume + volumeIncrement * i;
    await VolumeManager.setVolume(newVolume); // Adjust the volume in steps
    await sleep(stepDuration);
  }
};

const restoreOriginalVolume = async () => {
  if (VolumeManager) { // Check if VolumeManager exists
    await VolumeManager.setVolume(originalVolume); // Restore the original volume after the alarm
  }
};

const alarmBackgroundTask = async (taskDataArguments) => {
  const { delay, secondsToRing } = taskDataArguments;

  let preloaded = false;
  let elapsedTime = 0; // Initialize elapsedTime to track the duration

  for (let i = 0; BackgroundService.isRunning(); i++) {
    elapsedTime += delay / 1000; // Update elapsedTime based on the delay
    console.log('🚀 elapsedTime:', elapsedTime);

    if (!preloaded) {
      await preloadAudio();
      await setupTrackPlayer();
      preloaded = true;
    }

    playSilentClipContinuously();

    if (elapsedTime >= secondsToRing) {
      console.log('🚀 Alarm time reached');

      await adjustVolumeGradually(1); // Gradually increase the volume before playing the alarm
      if (!backgroundSound) {
        const background = await Audio.Sound.createAsync(require('../assets/sounds/birds2.wav'), {
          shouldPlay: true,
          isLooping: true,
        });
        backgroundSound = background.sound;
      }
      if (!(await backgroundSound.getStatusAsync()).isPlaying) {
        await backgroundSound.playAsync();
      }

      // Exit the loop and stop the background service after playing the alarm
      await BackgroundService.stop();
      return;
    }

    await sleep(delay);
  }
};

const StartAlarmEvent = async (secondsToRing) => {
  const finalSecondsToRing = secondsToRing < 30 ? 30 : secondsToRing;
  console.log('🚀 secondsToRing:', finalSecondsToRing);

  const options = {
    taskName: 'AlarmTask',
    taskTitle: 'Alarm Background Task',
    taskDesc: 'Manages alarm sounds in the background.',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#ff00ff',
    linkingURI: 'yourSchemeHere://chat/jane',
    parameters: {
      delay: 10000,
      secondsToRing: finalSecondsToRing,
    },
  };

  await BackgroundService.start(alarmBackgroundTask, options);
};

const StopAlarmEvent = async () => {
  if (backgroundSound) {
    await backgroundSound.stopAsync();
    await backgroundSound.unloadAsync();
    backgroundSound = null;
  }

  if (silentSound) {
    await silentSound.stopAsync();
    await silentSound.unloadAsync();
    silentSound = null;
  }

  await restoreOriginalVolume(); // Restore the original volume level after stopping the alarm

  await BackgroundService.stop();
  await TrackPlayer.stop();
};

export { StartAlarmEvent, StopAlarmEvent };
