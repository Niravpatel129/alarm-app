import React, { useState } from 'react';
import { Text, View } from 'react-native';
import TimePicker from '../../components/TimePicker/TimePicker';

export default function HomeScreen() {
  const [selectedTime, setSelectedTime] = useState('');

  const handleTimeChange = (time) => {
    console.log('🚀  time:', time);
    setSelectedTime(time);
  };

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
      <TimePicker onTimeChange={handleTimeChange} />
      <View
        style={{
          marginTop: 40,
        }}
      >
        <Text
          style={{
            color: 'white',
          }}
        >
          Selected Time: {selectedTime}
        </Text>
      </View>
    </View>
  );
}
