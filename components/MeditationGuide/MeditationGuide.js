import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const MeditationGuide = ({ messages, onMessagesDone }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const opacity = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 1000,
        easing: Easing.linear,
      }),
    };
  });

  useEffect(() => {
    if (messages.length === 0) {
      return;
    }

    opacity.value = 0;
    let timer = setTimeout(() => {
      opacity.value = 1;

      let changeMessageTimer = setTimeout(() => {
        setCurrentMessageIndex((prevIndex) => {
          if (prevIndex + 1 < messages.length) {
            return prevIndex + 1;
          } else {
            onMessagesDone(); // Call the callback function when all messages have been shown
            return prevIndex;
          }
        });
      }, 4000);

      return () => {
        clearTimeout(changeMessageTimer);
      };
    }, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [currentMessageIndex, messages.length, opacity, onMessagesDone]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.messageContainer, animatedStyles]}>
        <Text style={styles.messageText}>{messages[currentMessageIndex]}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  messageContainer: {
    padding: 20,
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  messageText: {
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
});

export default MeditationGuide;
