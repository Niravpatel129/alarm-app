import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import TaskAddScreen from './components/TaskAddScreen';
import TaskListScreen from './components/TaskListScreen';

const fakeTasks = [
  { id: '1', text: 'Wake up smarter' },
  { id: '2', text: 'Wake up smarter' },
  { id: '3', text: 'Wake up smarter' },
  { id: '4', text: 'Wake up smarter' },
  { id: '5', text: 'Wake up smarter' },
];

const TaskModal = ({ isVisible, onClose, selectedTask, setSelectedTask }) => {
  const [screens, setScreens] = useState('main');
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setScreens('main');
  }, [isVisible]);

  useEffect(() => {
    translateY.setValue(0);
  }, [isVisible, translateY]);

  const onGestureEvent = Animated.event([{ nativeEvent: { translationY: translateY } }], {
    useNativeDriver: true,
  });

  const onAdd = (task) => {
    console.log('Add task:', task);
    onClose();
  };

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

  const switchScreens = () => {
    switch (screens) {
      case 'main':
        return (
          <TaskListScreen
            setSelectedTask={setSelectedTask}
            onClose={onClose}
            setScreens={setScreens}
            fakeTasks={fakeTasks}
            selectedTask={selectedTask}
          />
        );
      case 'task':
        return <TaskAddScreen onAdd={onAdd} />;
      default:
        return null;
    }
  };

  return (
    <Modal transparent visible={isVisible} animationType='slide' onRequestClose={onClose}>
      <View style={styles.modalOverlay} onStartShouldSetResponder={() => true}>
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
                  flex: 1,
                  transform: [
                    {
                      translateY: translateY.interpolate({
                        inputRange: [0, 500],
                        outputRange: [0, 500],
                        extrapolate: 'clamp',
                      }),
                    },
                  ],
                  opacity: translateY.interpolate({
                    inputRange: [0, 250, 500],
                    outputRange: [1, 0.5, 0],
                    extrapolate: 'clamp',
                  }),
                },
              ]}
            >
              <View style={{ flex: 1 }}>{switchScreens()}</View>
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
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 16,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    maxHeight: '60%',
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
