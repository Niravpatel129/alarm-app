import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Image, Text, View } from 'react-native';
import Button from '../../components/Button/Button';
import TimePicker from '../../components/TimePicker/TimePicker';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [selectedTime, setSelectedTime] = useState('01:00 AM');
  const [showGuide, setShowGuide] = useState(false);
  const [isSleepMode, setIsSleepMode] = useState(true); // State to track sleep or wake up mode
  const [messages, setMessages] = useState([
    'Breathe in...',
    'Breathe out...',
    'Focus on your breath...',
  ]);

  const sleepMessages = ['Breathe in...', 'Breathe out...', 'Focus on your breath...'];

  const wakeUpMessages = ['Welcome back...', 'Stretch your body...', 'Prepare for the day...'];

  const handleTimeChange = (time) => {
    setSelectedTime(time);
  };

  const toggleGuide = () => {
    navigation.navigate('InSleep');
    return;
    setShowGuide(!showGuide);
    if (!showGuide) {
      setMessages(isSleepMode ? sleepMessages : wakeUpMessages);
    }

    setIsSleepMode(!isSleepMode);
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
      <Image
        source={require('../../assets/monk.png')}
        style={{ width: 200, height: 200, marginBottom: 40 }}
      />
      <TimePicker onTimeChange={handleTimeChange} />
      <View style={{ marginTop: 40 }}>
        <Text style={{ color: 'white' }}>Selected Time: {selectedTime}</Text>
      </View>
      <View style={{ marginTop: 40 }}>
        {/* Update button text based on the mode */}
        <Button onPress={toggleGuide} text={isSleepMode ? 'Sleep' : 'Wake Up'} />
      </View>
    </View>
  );
}
