import { AntDesign } from '@expo/vector-icons'; // Import AntDesign for the chevron icon
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MeditationGuide from '../../components/MeditationGuide/MeditationGuide';

export default function InSleep() {
  const [showGuide, setShowGuide] = useState(true);
  const [messages, setMessages] = useState([
    'Breathe in...',
    'Breathe out...',
    'Focus on your breath...',
  ]);

  const handleSlide = () => {
    console.log('Slide to stop or close');
  };

  return (
    <>
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View style={styles.container}>
          <Text style={styles.timeText}>12:34PM</Text>
          <Text style={styles.alarmText}>
            Alarm{' '}
            <Text style={styles.alarmTime} onPress={() => console.log('Alarm time clicked')}>
              5:30AM
            </Text>
          </Text>
          <TouchableOpacity style={styles.chevronContainer} onPress={handleSlide}>
            <AntDesign name='down' size={24} color='white' />
          </TouchableOpacity>
        </View>
        {showGuide && <MeditationGuide messages={messages} setShowGuide={setShowGuide} />}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50, // To ensure the chevron is at the bottom
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
  },
  alarmText: {
    marginTop: 20,
    fontSize: 24,
    color: 'white',
  },
  alarmTime: {
    textDecorationLine: 'underline',
  },
  chevronContainer: {
    position: 'absolute',
    bottom: 20, // Position at the bottom of the screen
  },
});
