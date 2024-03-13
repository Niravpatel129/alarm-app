import React from 'react';
import { View } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const TimePicker = ({ isVisible, onConfirm, onCancel, value }) => {
  return (
    <View>
      <DateTimePickerModal
        isVisible={isVisible}
        mode='time'
        onConfirm={onConfirm}
        onCancel={onCancel}
        date={value}
      
      />
    </View>
  );
};

export default TimePicker;
