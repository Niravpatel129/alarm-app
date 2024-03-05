import { Audio } from 'expo-av';
import BackgroundService from 'react-native-background-actions';
import TrackPlayer, { Capability } from 'react-native-track-player';

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

let backgroundSound = null;

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

const playSilentClipAtIntervals = async () => {
  const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/silent.mp3'), {
    shouldPlay: false,
  });

  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
  });

  sound.playAsync().then(() => {
    sound.setPositionAsync(0);
  });

  return () => {
    sound.unloadAsync();
  };
};

const veryIntensiveTask = async (taskDataArguments) => {
  const { delay } = taskDataArguments;

  await setupTrackPlayer();

  for (let i = 0; BackgroundService.isRunning(); i++) {
    console.log(`Background iteration: ${i}`);

    if (i % 10 === 0) {
      playSilentClipAtIntervals();
    }

    if (i === 300 && !backgroundSound) {
      const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/birds2.wav'), {
        shouldPlay: true,
        isLooping: true,
      });
      backgroundSound = sound;

      sound.playAsync();
    }

    await sleep(delay);
  }
};

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane',
  parameters: {
    delay: 1000, // Adjust this delay as per your task requirements
  },
};

const doSomething = async () => {
  await BackgroundService.start(veryIntensiveTask, options);
};

const doSomethingElse = async () => {
  if (backgroundSound) {
    await backgroundSound.stopAsync();
    await backgroundSound.unloadAsync();
    backgroundSound = null;
  }

  await BackgroundService.stop(); // Stops the background service
  await TrackPlayer.stop(); // Stops the TrackPlayer if it was used
};

export { doSomething, doSomethingElse };
