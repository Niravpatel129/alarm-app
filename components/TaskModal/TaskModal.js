import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import TaskAddScreen from './components/TaskAddScreen';
import TaskListScreen from './components/TaskListScreen';

const fakeTasks = [
  { id: '1', text: 'Finalize the investment proposal by noon' },
  { id: '2', text: 'Complete 5 miles morning run for marathon training' },
  { id: '3', text: 'Finish coding the new feature for the app' },
  { id: '4', text: 'Draft and send the marketing strategy to the team' },
  { id: '5', text: 'Analyze and report on the monthly sales data' },
  { id: '6', text: 'Study advanced algorithms for the upcoming interview' },
  { id: '7', text: 'Network with 5 new industry contacts on LinkedIn' },
  { id: '8', text: 'Read and summarize the latest industry report' },
  { id: '9', text: 'Plan the next quarter’s project milestones' },
  { id: '10', text: 'Meditate 20 minutes to enhance focus and clarity' },
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
