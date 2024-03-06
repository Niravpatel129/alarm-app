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
  if (!silentSound) {
    const silent = await Audio.Sound.createAsync(require('../assets/sounds/silent.mp3'), {
      shouldPlay: false,
    });
    silentSound = silent.sound;
  }

  if (!backgroundSound) {
    const background = await Audio.Sound.createAsync(require('../assets/sounds/birds2.wav'), {
      shouldPlay: false,
      isLooping: true,
    });
    backgroundSound = background.sound;
  }

  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
  });
};

const playSilentClipAtIntervals = async () => {
  await silentSound.setPositionAsync(0);
  await silentSound.playAsync();
};

const alarmBackgroundTask = async (taskDataArguments) => {
  const { delay, secondsToRing } = taskDataArguments;
  console.log('Alarm Background Task Started - delay, secondsToRing:', delay, secondsToRing);

  await preloadAudio();
  await setupTrackPlayer();

  for (let i = 0; BackgroundService.isRunning(); i++) {
    console.log(`Background iteration: ${i}`);

    if (i % 10 === 0) {
      playSilentClipAtIntervals();
    }

    if (i === secondsToRing) {
      backgroundSound.playAsync();
    }

    await sleep(delay || 1000);
  }
};

const StartAlarmEvent = async (timeToRing) => {
  console.log('🚀  timeToRing 123:', timeToRing);

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
      delay: 1000,
      secondsToRing: timeToRing || 1000,
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
