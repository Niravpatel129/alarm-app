import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { useEffect } from 'react';

const TASK_NAME = 'CHECK_TIME_TASK';

// Define the logic as a reusable function
const checkTime = () => {
  const currentTime = new Date();
  const targetTime = new Date();

  // Set the target time to 10 PM on the current day
  targetTime.setHours(1, 0, 0, 0);

  const isPastTargetTime = currentTime > targetTime;
  console.log(isPastTargetTime ? 'Past 12 PM' : 'Before 12 PM');
  return isPastTargetTime;
};

// Define the background task
TaskManager.defineTask(TASK_NAME, () => {
  const isPastTargetTime = checkTime();
  return isPastTargetTime ? 'new-data' : 'no-data';
});

export function useBackgroundTimeCheck() {
  useEffect(() => {
    console.log('useBackgroundTimeCheck()');

    async function registerBackgroundTask() {
      try {
        const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
        if (!isRegistered) {
          // Define minimum interval as 15 minutes
          const options = { minimumInterval: 900 };
          await BackgroundFetch.registerTaskAsync(TASK_NAME, options);
          console.log('Background time check task registered.');
        }

        checkTime();
      } catch (error) {
        console.log('Failed to register background time check task:', error);
      }
    }

    registerBackgroundTask();

    // Optionally, you can unregister the task when the component unmounts
    return () => {
      BackgroundFetch.unregisterTaskAsync(TASK_NAME).then(() => {
        console.log('Background time check task unregistered.');
      });
    };
  }, []);
}
