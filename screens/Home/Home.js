import React from 'react';
import { Image, Text, View } from 'react-native';
import Button from '../../components/Button/Button';
import TimePicker from '../../components/TimePicker/TimePicker';
import { useEnhancedAlarmLogic } from '../../hooks/useEnhancedAlarmLogic';

export default function HomeScreen() {
  const { selectedTime, handleTimeChange, toggleGuide } = useEnhancedAlarmLogic();

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
      <TimePicker onTimeChange={handleTimeChange} />
      <View style={{ marginTop: 40 }}>
        <Text style={{ color: 'white' }}>Selected Time: {selectedTime}</Text>
      </View>
      <View style={{ marginTop: 40 }}>
        <Button onPress={toggleGuide} text={'Sleep'} />
      </View>
    </View>
  );
}
