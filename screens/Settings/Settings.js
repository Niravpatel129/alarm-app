import React, { useState } from 'react';
import { Text, View } from 'react-native';
import TimePicker from '../../components/TimePicker/TimePicker';

const Settings = () => {
  const [selectedTime, setSelectedTime] = useState('');

  const handleTimeChange = (time) => {
    console.log('🚀  time:', time);
    setSelectedTime(time);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TimePicker onTimeChange={handleTimeChange} />
      <Text>Selected Time: {selectedTime}</Text>
    </View>
  );
};

export default Settings;
