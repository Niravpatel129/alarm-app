import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MeditationGuide from '../../components/MeditationGuide/MeditationGuide';
import { useEnhancedAlarmLogic } from '../../hooks/useEnhancedAlarmLogic'; // Ensure the path is correct

export default function InSleep() {
  const { showGuide, messages, toggleGuide } = useEnhancedAlarmLogic(); // Assuming this hook manages `showGuide`

  const handleSlide = () => {
    toggleGuide(); // Use toggleGuide to hide/show the guide or switch modes
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
          {/* Adjusted parts to use hook's state and methods */}
          <TouchableOpacity style={styles.chevronContainer} onPress={handleSlide}>
            <AntDesign name='down' size={24} color='white' />
          </TouchableOpacity>
        </View>
        {showGuide && <MeditationGuide messages={messages} />}
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
