import { Audio } from 'expo-av';
import BackgroundService from 'react-native-background-actions';
import TrackPlayer, { Capability } from 'react-native-track-player';

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

let backgroundSound = null; // Global reference for the background sound

// Setups TrackPlayer without adding a silent track to be played continuously
const setupTrackPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      stopWithApp: true, // Change to true to ensure the track stops with the app
      capabilities: [Capability.Play, Capability.Pause],
      playInBackground: true,
      pauseInBackground: true,
    });
  } catch (error) {
    console.log('Error setting up track player', error);
  }
};

// Plays a very short, silent audio clip at regular intervals to keep the app active
const playSilentClipAtIntervals = async () => {
  const intervalDuration = 60000; // For example, every 60 seconds

  // Assuming the silent.mp3 is a very short clip and stored appropriately
  const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/silent.mp3'), {
    shouldPlay: false,
  });

  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: true,
  });

  const intervalId = setInterval(() => {
    sound.playAsync().then(() => {
      sound.setPositionAsync(0); // Reset audio position for the next play
    });
  }, intervalDuration);

  return () => {
    clearInterval(intervalId);
    sound.unloadAsync(); // Cleanup the sound instance
  };
};

const veryIntensiveTask = async (taskDataArguments) => {
  const { delay } = taskDataArguments;

  await setupTrackPlayer(); // Setup the track player for later use
  const stopPlayingSilentClip = await playSilentClipAtIntervals(); // Start playing the silent clip at intervals

  // Your background task logic goes here
  for (let i = 0; BackgroundService.isRunning(); i++) {
    console.log(`Background iteration: ${i}`);
    if (i === 300 && !backgroundSound) {
      // Example to play a different sound after some iterations
      const { sound } = await Audio.Sound.createAsync(require('../assets/sounds/birds2.wav'), {
        shouldPlay: true,
        isLooping: true,
      });
      backgroundSound = sound;

      sound.playAsync();
    }

    await sleep(delay); // Wait for the specified delay
  }

  stopPlayingSilentClip(); // Stop playing the silent clip when not needed
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
