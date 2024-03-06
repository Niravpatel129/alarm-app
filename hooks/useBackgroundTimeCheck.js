import AsyncStorage from '@react-native-async-storage/async-storage';
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { StartAlarmEvent, StopAlarmEvent } from './useBackgroundTask';

const TASK_NAME = 'CHECK_TIME_TASK';
const TIME_STORAGE_KEY = 'TARGET_TIME';

const checkTime = async () => {
  console.log('checkTime()');

  const targetTimeString = await AsyncStorage.getItem(TIME_STORAGE_KEY);
  if (!targetTimeString) {
    console.log('No target time set');
    return false;
  }

  const [targetHours, targetMinutes] = targetTimeString.split(':').map(Number);
  const currentTime = new Date();
  const targetTime = new Date(
    currentTime.getFullYear(),
    currentTime.getMonth(),
    currentTime.getDate(),
    targetHours,
    targetMinutes,
  );

  const timeDifference = Math.abs(currentTime.getTime() - targetTime.getTime()) / (1000 * 60); // Difference in minutes
  const isWithinRange = timeDifference <= 60;

  if (isWithinRange) {
    console.log('Time is within range, unregistering task');
    const secondsToRing = Math.floor(timeDifference * 60);
    StartAlarmEvent(secondsToRing);
    if (await TaskManager.isTaskRegisteredAsync(TASK_NAME)) {
      await BackgroundFetch.unregisterTaskAsync(TASK_NAME).catch(console.error);
    }
  } else {
    console.log('Time is not within range, keep checking');
  }

  return isWithinRange;
};

// Updated TaskManager definition to improve reliability
TaskManager.defineTask(TASK_NAME, async () => {
  console.log('Background task running');
  try {
    const isWithinRange = await checkTime();
    return isWithinRange
      ? BackgroundFetch.BackgroundFetchResult.NewData
      : BackgroundFetch.BackgroundFetchResult.NoData;
  } catch (error) {
    console.error('Error running background task:', error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// Refactored custom hook for better code organization
export function useBackgroundTimeCheck() {
  const startAlarmBackground = async (timeString) => {
    console.log('Starting alarm background task');
    try {
      let [time, period] = timeString.split(' ');
      let [hours, minutes] = time.split(':').map(Number);

      // Convert 12-hour clock to 24-hour clock format
      if (period.toUpperCase() === 'PM' && hours < 12) {
        hours += 12;
      } else if (period.toUpperCase() === 'AM' && hours === 12) {
        hours = 0;
      }

      await AsyncStorage.setItem(TIME_STORAGE_KEY, `${hours}:${minutes}`);

      const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
      if (!isRegistered) {
        await BackgroundFetch.registerTaskAsync(TASK_NAME, { minimumInterval: 900 })
          .then(() => {
            console.log('Background time check registered.');
          })
          .catch(console.error);
      }

      await checkTime();
    } catch (error) {
      console.error('Failed to start background time check task:', error);
    }
  };

  const stopAlarmBackground = async () => {
    console.log('Stopping alarm background task');
    try {
      StopAlarmEvent();
      const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
      if (isRegistered) {
        await BackgroundFetch.unregisterTaskAsync(TASK_NAME).catch(console.error);
      }
      await AsyncStorage.removeItem(TIME_STORAGE_KEY);
      console.log('Background time check task stopped.');
    } catch (error) {
      console.error('Failed to stop background time check task:', error);
    }
  };

  return { startAlarmBackground, stopAlarmBackground };
}
