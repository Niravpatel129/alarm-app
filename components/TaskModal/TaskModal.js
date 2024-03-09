import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const fakeTasks = [
  { id: '1', text: 'Click the play button on the right to start...' },
  { id: '2', text: 'Click the left circle button to complete...' },
  { id: '3', text: 'Swipe to the left to see more operations' },
  { id: '4', text: 'Before you start the timer, set an intention...' },
  { id: '5', text: 'Click the "Show completed tasks" button...' },
];

const TaskModal = ({ isVisible, onClose }) => {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
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
          tension: 200,
          friction: 12,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  return (
    <Modal transparent visible={isVisible} animationType='slide' onRequestClose={onClose}>
      {/* Overlay View */}
      <View style={styles.modalOverlay} onStartShouldSetResponder={() => true}>
        {/* Prevent touches on the modal content from closing the modal */}
        <TouchableOpacity
          activeOpacity={1}
          style={{ flex: 1, justifyContent: 'flex-end' }}
          onPress={onClose}
        >
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
                        inputRange: [0, 500], // Adjust based on your modal's height
                        outputRange: [0, 500],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                  opacity: translateY.interpolate({
                    inputRange: [0, 250, 500], // Adjust based on your modal's height
                    outputRange: [1, 0.5, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              <View style={styles.header}>
                <Text style={styles.headerTitle}>Today</Text>
                <TouchableOpacity
                  onPress={() => {
                    console.log('Add task');
                  }}
                >
                  <AntDesign name='pluscircleo' size={24} color='red' />
                </TouchableOpacity>
              </View>
              <FlatList
                data={fakeTasks}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.taskItem} onPress={() => {}}>
                    <Text style={styles.taskText}>{item.text}</Text>

                    <AntDesign name='arrowright' size={20} color='red' />
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id}
              />
              <View
                style={{
                  marginTop: 30,
                  marginBottom: 60,
                }}
              >
                <TouchableOpacity
                  style={{ backgroundColor: '#f1f1f1', padding: 20, borderRadius: 40 }}
                  onPress={onClose}
                >
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 20,
                      fontWeight: 300,
                      textAlign: 'center',
                    }}
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </PanGestureHandler>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0,0,0,0.5)', // Semi-transparent background
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    maxHeight: '80%',
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
    paddingVertical: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'lightgrey',
  },
  taskText: {
    color: 'black',
    fontSize: 18,
  },
});

export default TaskModal;
