import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MeditationGuide from '../../components/MeditationGuide/MeditationGuide';
import { useEnhancedAlarmLogic } from '../../hooks/useEnhancedAlarmLogic'; // Ensure the path is correct

export default function InSleep() {
  const { messages, showGuide, toggleGuide, stopAlarm, messageTitle } =
    useEnhancedAlarmLogic('01:00 AM');

  const handleCompletion = () => {
    console.log('Alarm completed');
    stopAlarm();
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View style={styles.container}>
          <Text style={styles.timeText}>12:34PM</Text>
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 20, // Position at the bottom of the screen
              zIndex: 1, // Ensure it's above the SafeAreaView
            }}
            onPress={handleCompletion}
          >
            <AntDesign name='down' size={24} color='white' />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      {showGuide && (
        <MeditationGuide
          messageTitle={messageTitle}
          messages={messages}
          onCompletion={() => toggleGuide()}
        />
      )}
    </View>
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
  // chevronContainer: {
  //   position: 'absolute',
  //   bottom: 20, // Position at the bottom of the screen
  // },
});
