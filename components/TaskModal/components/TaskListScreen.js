import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { Animated, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';

const TaskListScreen = ({
  setSelectedTask,
  onClose,
  setScreens,
  tasks,
  selectedTask,
  onDelete,
}) => {
  // Render swipeable delete button with smooth animations
  const renderRightActions = (progress, dragX, item) => {
    const translateX = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const opacity = dragX.interpolate({
      inputRange: [-100, -50, 0],
      outputRange: [1, 0.5, 0],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={{ flex: 1, justifyContent: 'center', transform: [{ translateX }], opacity }}>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today</Text>
        <TouchableOpacity
          onPress={() => {
            console.log('Add task');
            setScreens('task');
          }}>
          <AntDesign name="pluscircleo" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item)}>
            <TouchableOpacity
              style={styles.taskItem}
              onPress={() => {
                setSelectedTask(item);
                onClose();
              }}>
              <Text
                style={[
                  styles.taskText,
                  {
                    fontWeight: selectedTask?.id === item.id ? 'bold' : 'normal',
                  },
                ]}>
                {item.text}
              </Text>
              <View style={styles.rightIcon}>
                <AntDesign name="arrowright" size={20} color="red" />
              </View>
            </TouchableOpacity>
          </Swipeable>
        )}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.closeButtonContainer}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeButtonText}>Close</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
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
    fontSize: 16,
    maxWidth: '80%',
  },
  rightIcon: {
    // Your existing styles for the right icon, if any
  },
  closeButtonContainer: {
    // Adjust these styles if necessary
  },
  closeButton: {
    backgroundColor: '#f1f1f1',
    padding: 20,
    borderRadius: 40,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 20,
    textAlign: 'center',
    // React Native does not support numeric font weights except 'bold',
    // if you previously had fontWeight: '300', change it to 'normal' or 'bold' as appropriate.
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100, // Adjust as needed
    height: '100%',
    position: 'absolute',
    right: 0,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default TaskListScreen;
