import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export default function Button() {
  return (
    <TouchableOpacity
      style={{
        borderRadius: 10,
        backgroundColor: '#3A3E52',
        padding: 16,
        width: 200,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: 'white',
          fontSize: 16,
        }}
      >
        Sleep
      </Text>
    </TouchableOpacity>
  );
}
