import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const fakeTasks = [
  { id: '1', text: 'Click the play button on the right to start...' },
  { id: '2', text: 'Click the left circle button to complete...' },
  { id: '3', text: 'Swipe to the left to see more operations' },
  { id: '4', text: 'Before you start the timer, set an intenti...' },
  { id: '5', text: 'Click the "Show completed tasks" butt...' },
];

const TaskModal = ({ isVisible, onClose }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reset translateY to 0 whenever isVisible changes, to ensure modal starts from the correct position
    translateY.setValue(0);
  }, [isVisible, translateY]);

  const onGestureEvent = Animated.event([{ nativeEvent: { translationY: translateY } }], {
    useNativeDriver: true,
  });

  const onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.state === State.END) {
      if (nativeEvent.translationY > 100) {
        onClose();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          tension: 200, // Adjust the tension for a snappier animation
          friction: 12, // Adjust the friction to control the bounciness
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const modalHeight = 500; // Adjust this value based on your modal's content height

  return (
    <Modal transparent visible={isVisible} animationType='slide' onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} activeOpacity={1}>
        <PanGestureHandler
          onGestureEvent={onGestureEvent}
          onHandlerStateChange={onHandlerStateChange}
        >
          <Animated.View
            style={[
              styles.modalContainer,
              {
                transform: [
                  {
                    translateY: translateY.interpolate({
                      inputRange: [0, modalHeight],
                      outputRange: [0, modalHeight],
                      extrapolate: 'clamp',
                    }),
                  },
                ],
                // Use the animated value to control the opacity for a smoother transition
                opacity: translateY.interpolate({
                  inputRange: [0, modalHeight * 0.5, modalHeight],
                  outputRange: [1, 0.5, 0],
                  extrapolate: 'clamp',
                }),
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Today</Text>
              <TouchableOpacity onPress={() => {}}>
                <AntDesign name='pluscircleo' size={24} color='red' />
              </TouchableOpacity>
            </View>
            <FlatList
              data={fakeTasks}
              renderItem={({ item }) => (
                <View style={styles.taskItem}>
                  <Text style={styles.taskText}>{item.text}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      /* function to handle task completion */
                    }}
                  >
                    <AntDesign name='circledowno' size={24} color='red' />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          </Animated.View>
        </PanGestureHandler>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    maxHeight: '80%', // Adjust as needed
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgrey',
  },
  taskText: {
    color: 'black',
    fontSize: 18,
  },
});

export default TaskModal;
