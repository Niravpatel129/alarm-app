import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import GradientText from '../GradientText/GradientText';

const MeditationGuide = ({ messages, onCompletion }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
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
          const nextIndex = prevIndex + 1;
          if (nextIndex < messages.length) {
            return nextIndex;
          } else {
            setIsCompleted(true);
            return prevIndex; // Keep the last message displayed
          }
        });
      }, 4000); // Show each message for 4 seconds before moving to the next

      return () => {
        clearTimeout(changeMessageTimer);
      };
    }, 100); // Short delay before starting to fade in the next message

    return () => {
      clearTimeout(timer);
    };
  }, [currentMessageIndex, messages.length, opacity]);

  useEffect(() => {
    if (isCompleted) {
      onCompletion();
    }
  }, [isCompleted, onCompletion]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.messageContainer, animatedStyles]}>
        <GradientText
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: 'white',
          }}
        >
          {messages[currentMessageIndex]}
        </GradientText>
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
