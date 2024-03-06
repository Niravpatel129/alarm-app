import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { StartAlarmEvent, StopAlarmEvent } from './useBackgroundTask';

const TASK_NAME = 'CHECK_TIME_TASK';
const TIME_STORAGE_KEY = 'TARGET_TIME';

const checkTime = async () => {
  console.log('checkTime()');

  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate a delay

  const targetTimeString = await AsyncStorage.getItem(TIME_STORAGE_KEY);
  if (!targetTimeString) {
    console.log('No target time set');
    return false;
  }

  const [targetHours, targetMinutes] = targetTimeString.split(':').map(Number);
  const currentTime = new Date();
  const targetTime = new Date();

  targetTime.setHours(targetHours, targetMinutes, 0, 0);

  const timeDifference = Math.abs(currentTime - targetTime) / (1000 * 60); // Difference in minutes
  const isWithinRange = timeDifference <= 15;

  if (isWithinRange) {
    // unregister the task
    console.log('Time is within range, unregistering task');
    // in seconds to ring the alarm
    const secondsToRing = Math.floor(timeDifference * 60);
    StartAlarmEvent(secondsToRing);
    if (await TaskManager.isTaskRegisteredAsync(TASK_NAME)) {
      await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
    }
  } else {
    console.log('Time is not within range, keep checking', timeDifference);
  }

  return isWithinRange;
};

TaskManager.defineTask(TASK_NAME, async () => {
  console.log('Background task running');

  const isWithinRange = await checkTime();

  return isWithinRange ? 'within range' : 'not within range';
});

export function useBackgroundTimeCheck() {
  const startAlarmBackground = async (timeString) => {
    console.log('start alarm ⏰😮‍💨');
    try {
      let [time, period] = timeString.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      if (period.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
      } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }

      await AsyncStorage.setItem(TIME_STORAGE_KEY, `${hours}:${minutes}`);

      const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
      if (!isRegistered) {
        const options = { minimumInterval: 900 };
        await BackgroundFetch.registerTaskAsync(TASK_NAME, options);
      }

      await checkTime();
    } catch (error) {
      console.log('Failed to register background time check task:', error);
    }
  };

  const stopAlarmBackground = async () => {
    console.log('stop alarm ⏰😮‍💨');
    StopAlarmEvent();
    // check if the task is registered
    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (!isRegistered) {
      console.log('Background time check task not registered.');
      return;
    }

    await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
    console.log('Background time check task unregistered.');
    await AsyncStorage.removeItem(TIME_STORAGE_KEY);
  };

  return { startAlarmBackground, stopAlarmBackground };
}
