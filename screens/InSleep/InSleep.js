import { AntDesign } from '@expo/vector-icons'; // Import AntDesign for the chevron icon
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function InSleep() {
  const handleSlide = () => {
    console.log('Slide to stop or close');
  };

  return (
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
          <AntDesign name='down' size={24} color='black' />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50, // To ensure the chevron is at the bottom
  },
  timeText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  alarmText: {
    marginTop: 20,
    fontSize: 24,
  },
  alarmTime: {
    textDecorationLine: 'underline',
  },
  chevronContainer: {
    position: 'absolute',
    bottom: 20, // Position at the bottom of the screen
  },
});
