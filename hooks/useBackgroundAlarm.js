// Import necessary libraries
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { useEffect } from 'react';
import BackgroundService from 'react-native-background-actions';

// Define the sleep function for delays
const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));

// Task to be run in the background
const backgroundTask = async (taskData) => {
  const { audioFile, interval } = taskData;
  const playbackObject = new Audio.Sound();

  try {
    // Load the audio file
    await playbackObject.loadAsync(require('../assets/sounds/bubble.mp3'));

    // Loop to keep playing audio at the specified interval
    for (;;) {
      await playbackObject.setPositionAsync(0); // Seek to the beginning
      await playbackObject.playAsync(); // Play the sound
      await sleep(interval); // Wait for the specified interval
    }
  } catch (error) {
    console.error('Error with playing audio in background:', error);
  }
};

// Options for the background service
const options = {
  taskName: 'Alarm',
  taskTitle: 'Alarm Playing',
  taskDesc: 'The alarm is playing in the background',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff0000',
  parameters: {
    delay: 10000,
  },
};

function useBackgroundAlarm() {
  useEffect(() => {
    let interval;

    async function setupAndStartBackgroundTask() {
      const intervalString = await AsyncStorage.getItem('interval');
      interval = Number(intervalString) || 10000; // Default to 10 seconds if not set

      // Path to the audio file
      const audioFile = '../assets/sounds/bubble.mp3';

      // Start the background task
      BackgroundService.start(backgroundTask, {
        ...options,
        parameters: { audioFile, interval },
      });
    }

    setupAndStartBackgroundTask();

    return () => {
      // Cleanup function to stop the background service when the component unmounts
      BackgroundService.stop();
    };
  }, []); // Empty dependency array means this effect runs only once after the initial render
}

export default useBackgroundAlarm;
