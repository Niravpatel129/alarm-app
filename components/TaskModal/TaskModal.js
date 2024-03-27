import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import TaskAddScreen from './components/TaskAddScreen';
import TaskListScreen from './components/TaskListScreen';

const fakeTasks = [
  { id: '1', text: 'Complete the project proposal for review' },
  { id: '2', text: 'Jog for 30 minutes to stay healthy' },
  { id: '3', text: 'Spend an hour learning a new programming language' },
  { id: '4', text: 'Meditate for 15 minutes to clear the mind' },
  { id: '5', text: 'Call a friend or family member to catch up' },
  { id: '6', text: 'Read a chapter of a book to relax and learn' },
  { id: '7', text: 'Plan the week’s meals for better nutrition' },
  { id: '8', text: 'Dedicate an hour to a hobby or personal project' },
];

const TaskModal = ({ isVisible, onClose, selectedTask, setSelectedTask }) => {
  const [tasks, setTasks] = useState(fakeTasks);
  const [screens, setScreens] = useState('main');
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // clear local storage
    // AsyncStorage.clear();
    const initializeTasks = async () => {
      // Check if the initialization flag exists and is true
      const isInitialized = await AsyncStorage.getItem('isInitialized');
      if (isInitialized !== 'true') {
        // If not initialized, set the fake tasks and mark as initialized
        await AsyncStorage.setItem('tasks', JSON.stringify(fakeTasks));
        await AsyncStorage.setItem('isInitialized', 'true');
      }

      // Load tasks from AsyncStorage
      const tasksString = await AsyncStorage.getItem('tasks');
      const loadedTasks = tasksString ? JSON.parse(tasksString) : [];
      setTasks(loadedTasks);
      setScreens('main');
    };

    if (isVisible) {
      initializeTasks();
    }
  }, [isVisible]);

  useEffect(() => {
    translateY.setValue(0);
  }, [isVisible, translateY]);

  const onGestureEvent = Animated.event([{ nativeEvent: { translationY: translateY } }], {
    useNativeDriver: true,
  });

  const onAdd = async (task) => {
    console.log('Add task:', task);
    const newTask = { id: String(tasks.length + 1), text: task };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setScreens('main');
  };

  const onDelete = async (taskId) => {
    console.log('Delete task:', taskId);

    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
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
            tasks={tasks}
            selectedTask={selectedTask}
            onDelete={onDelete}
          />
        );
      case 'task':
        return <TaskAddScreen onAdd={onAdd} onDelete={onDelete} />;
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
