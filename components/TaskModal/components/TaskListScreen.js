import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TaskListScreen = ({
  setSelectedTask,
  onClose,
  setScreens,
  tasks,
  selectedTask,
  onDelete,
}) => {
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today</Text>
        <TouchableOpacity
          onPress={() => {
            console.log('Add task');
            setScreens('task');
          }}
        >
          <AntDesign name='pluscircleo' size={24} color='red' />
        </TouchableOpacity>
      </View>
      <FlatList
        data={tasks}
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
                  fontWeight: selectedTask?.id === item.id ? 'bold' : 'normal',
                },
              ]}
            >
              {item.text}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 5,
              }}
            >
              <AntDesign name='arrowright' size={20} color='red' />
            </View>
          </TouchableOpacity>
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
  closeButtonContainer: {
    // marginTop: 30,
    // marginBottom: 60,
  },
  closeButton: {
    backgroundColor: '#f1f1f1',
    padding: 20,
    borderRadius: 40,
  },
  closeButtonText: {
    color: 'black',
    fontSize: 20,
    fontWeight: 300,
    textAlign: 'center',
  },
});

export default TaskListScreen;
