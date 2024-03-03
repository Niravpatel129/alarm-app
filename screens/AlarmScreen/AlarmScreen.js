import { Entypo, MaterialIcons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import { Image, PanResponder, SafeAreaView, Text, View } from 'react-native';

export default function AlarmScreen() {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        // Check if the swipe gesture is a deep swipe up
        const { dy } = gestureState;
        const swipeThreshold = -100; // Adjust this threshold value as needed
        if (dy < swipeThreshold) {
          // Perform action on deep swipe up
          console.log('Deep Swipe Up Detected');
          alert('Alarm dismissed');
          // Add your action here, for example, dismissing the alarm
        } else {
          // Perform action on shallow swipe up
          console.log('Shallow Swipe Up Detected');
        }
      },
    }),
  ).current;

  return (
    <View
      style={{
        backgroundColor: '#222027',
        flex: 1,
      }}
      {...panResponder.panHandlers}
    >
      <SafeAreaView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-evenly',
            height: '100%',
          }}
        >
          <Text
            style={{
              fontSize: 24,
              fontWeight: 400,
              color: 'white',
              marginTop: 20,
            }}
          >
            Today, Monday
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: '#ababac',
              marginTop: 5,
            }}
          >
            02.10.23
          </Text>
          <Image
            source={{
              uri: 'https://cdn.discordapp.com/attachments/1110409819808079982/1213631045644062740/image.png?ex=65f62cfd&is=65e3b7fd&hm=dfd2310522ce56203ded3bb354b4ddce53cb32beacde8801facc1e08b1db5e44&',
            }}
            style={{
              width: 200,
              height: 200,
            }}
          />
          <Image
            source={{
              uri: 'https://cdn.discordapp.com/attachments/1110409819808079982/1213631894797942824/2Q.png?ex=65f62dc7&is=65e3b8c7&hm=5cdc009c3e5252be6e329f550603469b27e90302cab63f5a2fad627509f99016&',
            }}
            style={{
              width: '100%',
              height: 200,
            }}
          />
          <Text
            style={{
              fontFamily: 'Roboto',
              fontSize: 84,
              color: 'white',
            }}
          >
            23:30
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 5,
              marginTop: 4,
            }}
          >
            <MaterialIcons name='access-alarms' size={18} color='#c0c0c0' />
            <Text
              style={{
                color: '#c0c0c0',
                fontSize: 16,
                fontFamily: 'Roboto',
              }}
            >
              Alarm 8:30
            </Text>
          </View>
          <View
            style={{
              marginTop: 40,
            }}
          >
            <Entypo name='chevron-thin-up' size={38} color='#4d4c52' />
            <Entypo
              name='chevron-thin-up'
              size={38}
              color='white'
              style={{
                marginTop: -15,
              }}
            />
          </View>
          <Text
            style={{
              color: '#7c7b7e',
              fontSize: 22,
              fontFamily: 'Roboto',
            }}
          >
            Swipe up to dismiss alarm
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
