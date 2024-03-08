import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ImageBackground, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeAlarm() {
  return (
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
                style={{
                  marginBottom: 80,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: 'white',
                  paddingVertical: 15,
                  paddingHorizontal: 25,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                }}
              >
                <Text
                  style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: 400,
                  }}
                >
                  *Please select a task ...
                </Text>
              </TouchableOpacity>
              <View
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
                  01 : 00 AM
                </Text>
              </View>
            </View>

            <View>
              <TouchableOpacity
                style={{
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: 'white',
                  backgroundColor: 'white',
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  paddingVertical: 5,
                  paddingHorizontal: 30,
                }}
              >
                <Text
                  style={{
                    color: 'black',
                    fontSize: 30,
                    fontWeight: 300,
                  }}
                >
                  Sleep
                </Text>
                <MaterialCommunityIcons name='sleep' size={24} color='black' />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}
