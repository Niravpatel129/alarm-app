import { Audio } from 'expo-av';
import BackgroundService from 'react-native-background-actions';
import TrackPlayer, { Capability } from 'react-native-track-player';

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

let backgroundSound = null;
let silentSound = null;

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
      interruptionModeIOS: 'DoNotMix',
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: 'DoNotMix',
      staysActiveInBackground: true,
      playThroughEarpieceAndroid: false,
    });
  } catch (e) {
    console.log(e);
  }
};

const playSilentClipAtIntervals = async () => {
  console.log('playSilentClipAtIntervals()');
  try {
    if (!silentSound) {
      await preloadAudio();
      console.log('silentSound not loaded', silentSound);
      return;
    }
    await silentSound.setPositionAsync(0);
    await silentSound.playAsync();
  } catch (e) {
    console.log(e);
  }
};

const alarmBackgroundTask = async (taskDataArguments) => {
  const { delay, secondsToRing } = taskDataArguments;

  let preloaded = false;
  let elapsedTime = 0; // Tracking elapsed time in seconds

  for (let i = 0; BackgroundService.isRunning(); i++) {
    elapsedTime += delay / 1000;
    console.log('🚀  elapsedTime:', elapsedTime);

    if (!preloaded && elapsedTime <= 30) {
      await preloadAudio();
      await setupTrackPlayer();
      preloaded = true;
    }

    if (elapsedTime >= secondsToRing) {
      if (!backgroundSound) {
        const background = await Audio.Sound.createAsync(require('../assets/sounds/birds2.wav'), {
          shouldPlay: false,
          isLooping: true,
        });
        backgroundSound = background.sound;
      }
      backgroundSound.playAsync();

      // Stop the background task
      await BackgroundService.stop();
      return;
    }

    playSilentClipAtIntervals();
    await sleep(delay);
  }
};

const StartAlarmEvent = async (secondsToRing) => {
  // Ensure a minimum of 30 seconds for the alarm to ring
  const finalSecondsToRing = secondsToRing < 30 ? 30 : secondsToRing;
  console.log('🚀  secondsToRing:', finalSecondsToRing);

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
      delay: 10000, // 10 seconds
      secondsToRing: finalSecondsToRing, // Adjusted to use seconds
    },
  };

  await BackgroundService.start(alarmBackgroundTask, options);
};

const StopAlarmEvent = async () => {
  if (backgroundSound) {
    await backgroundSound.stopAsync();
    await backgroundSound.unloadAsync();
  }

  if (silentSound) {
    await silentSound.unloadAsync();
    silentSound = null;
  }

  backgroundSound = null;

  await BackgroundService.stop();
  await TrackPlayer.stop();
};

export { StartAlarmEvent, StopAlarmEvent };
