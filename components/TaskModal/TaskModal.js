import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const fakeTasks = [
  { id: '1', text: 'Wake up smarter' },
  { id: '2', text: 'Wake up smarter' },
  { id: '3', text: 'Wake up smarter' },
  { id: '4', text: 'Wake up smarter' },
  { id: '5', text: 'Wake up smarter' },
];

const TaskModal = ({ isVisible, onClose, selectedTask, setSelectedTask }) => {
  console.log('🚀  selectedTask:', selectedTask);
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
                  <TouchableOpacity
                    style={styles.taskItem}
                    onPress={() => {
                      setSelectedTask(item);
                      onClose();
                    }}
                  >
                    <Text
                      style={[
                        styles.taskText,
                        {
                          fontWeight: selectedTask?.id === item.id ? 800 : 400,
                        },
                      ]}
                    >
                      {console.log('🚀 ~ file: TaskModal.js ~ line 108 ~ item', selectedTask, item)}
                      {item.text}
                    </Text>

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
