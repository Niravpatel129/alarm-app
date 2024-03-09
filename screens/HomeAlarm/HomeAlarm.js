import React, { useState } from 'react';
import {
  ImageBackground,
  Pressable,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import TimePicker from '../../components/DateTimePicker/DateTimePicker';
import TaskModal from '../../components/TaskModal/TaskModal';

export default function HomeAlarm() {
  const [date, setDate] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleConfirm = (date) => {
    console.log('A date has been picked: ', date);
    setDate(date);
    hidePicker();
  };

  const showPicker = () => {
    setPickerVisible(true);
  };

  const hidePicker = () => {
    setPickerVisible(false);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <View>
        <ImageBackground
          source={{
            uri: 'https://preview.redd.it/night-sky-forests-and-mountains-5952x3264-v0-drtekja8qmib1.jpg?auto=webp&s=be3ef7ff71772d9eff4c634240feed04dda3a7a7',
          }}
          style={{ width: '100%', height: '100%' }}
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View
              style={{
                flex: 1,
                justifyContent: 'space-around',
                alignItems: 'center',
              }}
            >
              <View>
                <TouchableOpacity
                  onPress={() => setModalVisible(true)}
                  style={{
                    marginBottom: 80,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: 'white',
                    paddingVertical: 15,
                    paddingHorizontal: 25,
                    backgroundColor: 'rgba(22, 22, 22, 0.45)',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: 400,
                      maxWidth: 300,
                      textAlign: 'center',
                    }}
                  >
                    {selectedTask?.text || '  * Please select a task ...'}
                  </Text>
                </TouchableOpacity>
                <Pressable
                  onPress={showPicker}
                  style={{
                    borderWidth: 1,
                    borderColor: 'white',
                    width: 300,
                    height: 300,
                    borderRadius: 300,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 60,
                      fontWeight: 100,
                    }}
                  >
                    {formatTime(date)
                      .toString()
                      .replace(/:/, ' : ')
                      .replace(/(AM|PM)/, ' $1')}
                  </Text>
                </Pressable>
              </View>

              <View>
                <TouchableOpacity
                  style={{
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    flexDirection: 'row',
                    gap: 10,
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 35,
                  }}
                >
                  <Text
                    style={{
                      color: 'black',
                      fontSize: 22,
                      fontWeight: 300,
                    }}
                  >
                    Sleep
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <TimePicker
              isVisible={isPickerVisible}
              onConfirm={handleConfirm}
              onCancel={hidePicker}
            />
          </SafeAreaView>
        </ImageBackground>
      </View>
      <TaskModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        setSelectedTask={setSelectedTask}
        selectedTask={selectedTask}
      />
    </>
  );
}
