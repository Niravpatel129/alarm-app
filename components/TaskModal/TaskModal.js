import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TaskModal = ({ isVisible, onClose }) => {
  return (
    <Modal transparent visible={isVisible} animationType='slide' onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1}>
        <View style={styles.modalContainer}>
          <Text
            style={{
              fontSize: 24, // Adjusted for better readability
              fontWeight: 'bold',
              textAlign: 'center',
              marginBottom: 16,
              color: 'black', // Changed for contrast with the white background
            }}
          >
            123
          </Text>
        </View>
      </TouchableOpacity>
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
    height: 450,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
  },
});

export default TaskModal;
