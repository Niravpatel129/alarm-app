import React from 'react';
import { Image, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Button from '../../components/Button/Button';
import TimePicker from '../../components/TimePicker/TimePicker';
import { useAlarmContext } from '../../context/Alarm/AlarmContext';
import { doSomething, doSomethingElse } from '../../hooks/useBackgroundTask';

export default function HomeScreen() {
  const { selectedTime, handleTimeChange, startAlarm } = useAlarmContext('01:00 AM');
  const selectedTimeShared = useSharedValue(selectedTime);

  // Call this function whenever the time changes
  const onTimeChange = (newTime) => {
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
        <Button onPress={() => doSomething()} text={'1'} />
      </View>
      <View style={{ marginTop: 40 }}>
        <Button onPress={() => doSomethingElse()} text={'2'} />
      </View>
    </View>
  );
}
