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
      stopWithApp: true,
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
      const silent = await Audio.Sound.createAsync(require('../assets/sounds/bubble.mp3'), {
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
  const { delay, minutesToRing } = taskDataArguments;

  let preloaded = false;

  for (let i = 0; BackgroundService.isRunning(); i++) {
    console.log('🚀  i:', i);
    const minutesLeft = minutesToRing - i;

    if (!preloaded && minutesLeft <= 5) {
      // Example threshold, adjust based on your needs
      await preloadAudio();
      await setupTrackPlayer();
      preloaded = true;
    }

    // Optimize silent clip playing
    if (i % 2 === 0) {
      console.log('Playing silent clip');
      // Reduce frequency based on your needs
      playSilentClipAtIntervals();
    }

    if (i === minutesToRing) {
      if (!backgroundSound) {
        const background = await Audio.Sound.createAsync(require('../assets/sounds/birds2.wav'), {
          shouldPlay: false,
          isLooping: true,
        });
        backgroundSound = background.sound;
      }
      backgroundSound.playAsync();

      // stop the background task
      await BackgroundService.stop();
      return;
    }

    await sleep(delay);
  }
};

const StartAlarmEvent = async (secondsToRing) => {
  const minutesToRing = Math.ceil(secondsToRing / 60);
  console.log('🚀  minutesToRing:', minutesToRing);

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
      delay: 60000, // 1 minute
      minutesToRing: minutesToRing, // Use the rounded-up minutes
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
