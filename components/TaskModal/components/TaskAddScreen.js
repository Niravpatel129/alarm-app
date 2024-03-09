import React, { useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const TaskAddScreen = ({ onAdd }) => {
  const [task, setTask] = useState('');

  const handleAddTask = () => {
    onAdd(task);
    setTask('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder='Add a task...'
              value={task}
              onChangeText={setTask}
              returnKeyType='done'
              onSubmitEditing={handleAddTask}
              blurOnSubmit={false}
              autoFocus={true}
            />
            <View style={styles.pomodoroContainer}>
              <Text style={styles.pomodoroLabel}>Estimated Pomodoros</Text>
              <View style={styles.pomodoroCounter}></View>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: 'white',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    paddingLeft: 15,
    height: 50,
    fontSize: 18,
    marginBottom: 20,
  },
  pomodoroContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  pomodoroLabel: {
    fontSize: 16,
    color: '#555',
  },
  pomodoroCounter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: '#007AFF',
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 30,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
  },
});

export default TaskAddScreen;
