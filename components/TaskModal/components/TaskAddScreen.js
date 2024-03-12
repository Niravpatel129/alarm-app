import { FontAwesome5 } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const TaskAddScreen = ({ onAdd }) => {
  const [task, setTask] = useState('');

  const handleAddTask = () => {
    console.log('Add task:', task);
    onAdd(task);
    setTask('');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={() => {}} accessible={false}>
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

            <View
              style={{
                borderWidth: 1,
                borderColor: '#cccccc',
                borderRightColor: 'transparent',
                borderLeftColor: 'transparent',
                borderBottomColor: 'transparent',
                paddingTop: 10,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flex: 1,
                  }}
                >
                  <TouchableOpacity>
                    <FontAwesome5 name='font-awesome-flag' size={24} color='black' />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <FontAwesome5 name='apple' size={24} color='black' />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <FontAwesome5 name='ad' size={24} color='black' />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <FontAwesome5 name='tag' size={24} color='black' />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  onPress={() => {
                    console.log('done');
                    handleAddTask();
                  }}
                  style={{
                    flex: 1,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'black',
                      textAlign: 'right',
                    }}
                  >
                    Done
                  </Text>
                </TouchableOpacity>
              </View>
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
    marginBottom: 10,
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
