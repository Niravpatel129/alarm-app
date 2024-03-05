import React from 'react';
import { Image, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Button from '../../components/Button/Button';
import TimePicker from '../../components/TimePicker/TimePicker';
import { useAlarmContext } from '../../context/Alarm/AlarmContext';
import { StartAlarmEvent, StopAlarmEvent } from '../../hooks/useBackgroundTask';
import useTTS from '../../hooks/useTTS';

export default function HomeScreen() {
  const { selectedTime, handleTimeChange, startAlarm } = useAlarmContext('01:00 AM');
  const [secondsToRing, setSecondsToRing] = React.useState(30);
  const selectedTimeShared = useSharedValue(selectedTime);
  const tts = useTTS();

  // Call this function whenever the time changes
  const onTimeChange = (newTime) => {
    console.log('🚀  newTime:', newTime); // Example format: 11:59 PM

    // Convert newTime string to a Date object representing the next occurrence of that time
    const now = new Date();
    const [time, modifier] = newTime.split(' ');
    let [hours, minutes] = time.split(':');

    // Convert 12-hour time to 24-hour time
    hours = parseInt(hours, 10);
    minutes = parseInt(minutes, 10);
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }

    // Create a Date object for the next occurrence of the alarm time
    const nextAlarmTime = new Date(now);
    nextAlarmTime.setHours(hours, minutes, 0, 0);

    // If the next alarm time is in the past, set it to the next day
    if (nextAlarmTime <= now) {
      nextAlarmTime.setDate(nextAlarmTime.getDate() + 1);
    }

    // Calculate the difference in seconds
    let secondsToRingAlarm = Math.floor((nextAlarmTime - now) / 1000) + 1;

    console.log('🔔 secondsToRingAlarm:', secondsToRingAlarm);
    setSecondsToRing(secondsToRingAlarm);

    handleTimeChange(newTime);
    selectedTimeShared.value = withTiming(newTime, { duration: 500 }); // Smooth transition for time update
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: selectedTimeShared.value === selectedTime ? 1 : 0.5, // Example of dynamic styling based on the selected time
    };
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        backgroundColor: '#242830',
      }}
    >
      <Image
        source={require('../../assets/monk.png')}
        style={{ width: 200, height: 200, marginBottom: 40 }}
      />
      <TimePicker onTimeChange={onTimeChange} />
      <View style={{ marginTop: 40 }}>
        <Animated.Text style={[{ color: 'white' }, animatedStyle]}>
          Selected Time: {selectedTime}
        </Animated.Text>
      </View>
      <View style={{ marginTop: 40 }}>
        <Button onPress={() => startAlarm(selectedTime)} text={'Sleep'} />
      </View>
      <View style={{ marginTop: 40 }}>
        <Button onPress={() => StartAlarmEvent(secondsToRing || 30)} text={'1'} />
      </View>
      <View style={{ marginTop: 40 }}>
        <Button onPress={() => StopAlarmEvent()} text={'2'} />
      </View>
      <View style={{ marginTop: 40 }}>
        <Button onPress={() => tts.readText()} text={'Speak'} />
      </View>
    </View>
  );
}
