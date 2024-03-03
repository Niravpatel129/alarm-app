import { Entypo, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Image, PanResponder, SafeAreaView, Text, View } from 'react-native';

export default function AlarmScreen() {
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        const { dy } = gestureState;
        const swipeThreshold = -100;
        if (dy < swipeThreshold) {
          console.log('Deep Swipe Up Detected');
        } else {
          console.log('Shallow Swipe Up Detected');
        }
      },
    }),
  ).current;

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

  const day = days[currentTime.getDay()];
  const date = `${currentTime.getDate() < 10 ? '0' : ''}${currentTime.getDate()}`;
  const month = months[currentTime.getMonth()];
  const year = currentTime.getFullYear();
  const hours = `${currentTime.getHours() < 10 ? '0' : ''}${currentTime.getHours()}`;
  const minutes = `${currentTime.getMinutes() < 10 ? '0' : ''}${currentTime.getMinutes()}`;

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
              fontWeight: '400',
              color: 'white',
              marginTop: 20,
            }}
          >
            Today, {day}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '400',
              color: '#ababac',
              marginTop: 5,
            }}
          >
            {date}.{month}.{year}
          </Text>
          <Image
            source={require('../../assets/images/moon.png')}
            style={{
              width: 200,
              height: 200,
            }}
          />
          <Image
            source={require('../../assets/images/waves.png')}
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
            {hours}:{minutes}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              gap: 3,
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
