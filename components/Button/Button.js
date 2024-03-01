import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function Button({ onPress, text }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        borderRadius: 10,
        backgroundColor: '#3A3E52',
        padding: 16,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',

        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },

        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 16,
        }}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
}
