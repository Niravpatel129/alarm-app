import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

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

    opacity.value = 0; // Reset opacity to 0 to fade in the next message
    let timer = setTimeout(() => {
      opacity.value = 1; // Start fading in the message

      // Change the message after it's fully visible for a period
      let changeMessageTimer = setTimeout(() => {
        setCurrentMessageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < messages.length) {
            return nextIndex;
          } else {
            // Trigger completion when all messages have been displayed
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

  // Notify parent component when the message sequence is completed
  useEffect(() => {
    if (isCompleted) {
      onCompletion();
    }
  }, [isCompleted, onCompletion]);

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
