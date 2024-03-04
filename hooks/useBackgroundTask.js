import { Audio } from 'expo-av';
import BackgroundService from 'react-native-background-actions';
import TrackPlayer, { Capability, RepeatMode } from 'react-native-track-player';

const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

let backgroundSound = null; // Global reference for the background sound

const setupTrackPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      stopWithApp: false,
      capabilities: [Capability.Play, Capability.Pause],
      playInBackground: true,
      pauseInBackground: true,
    });

    await TrackPlayer.add({
      id: 'silent-track',
      url: require('../assets/sounds/silent.mp3'),
      title: 'Silent Track',
      artist: 'Background Service',
      artwork: require('../assets/icon.png'),
    });

    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
  } catch (error) {
    console.log('Error setting up track player', error);
  }
};

const veryIntensiveTask = async (taskDataArguments) => {
  const { delay } = taskDataArguments;
  await setupTrackPlayer();
  await TrackPlayer.play();

  await new Promise(async (resolve) => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log('🚀  i:', i);
      if (i === 300 && !backgroundSound) {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/sounds/birds2.wav'),
          { shouldPlay: true, isLooping: true }, // Set to play immediately and loop
        );
        backgroundSound = sound; // Keep a reference to the sound object

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

        sound.playAsync(); // Explicitly start playback (if not auto-playing)
      }

      await sleep(delay);
    }
  });
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
    delay: 1000,
  },
};

const doSomething = async () => {
  await BackgroundService.start(veryIntensiveTask, options);
};

const doSomethingElse = async () => {
  if (backgroundSound) {
    await backgroundSound.stopAsync(); // Stop the background sound
    await backgroundSound.unloadAsync(); // Unload the sound from memory
    backgroundSound = null; // Clear the reference
  }

  await BackgroundService.stop();
  await TrackPlayer.stop();
};

export { doSomething, doSomethingElse };
