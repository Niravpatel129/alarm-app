import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const MeditationGuide = ({ messages, setShowGuide }) => {
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
      // Immediately hide if there are no messages, avoiding setting state directly here
      return;
    }

    opacity.value = 0; // Reset opacity to 0 to fade in the next message
    let timer = setTimeout(() => {
      opacity.value = 1; // Start fading in the message

      // Change the message after it's fully visible for a period
      let changeMessageTimer = setTimeout(() => {
        setCurrentMessageIndex((prevIndex) => {
          if (prevIndex + 1 < messages.length) {
            return prevIndex + 1;
          } else {
            // Avoid setting state directly here
            return prevIndex; // It might be better to reset to 0 for future re-use
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

  // Effect to handle visibility outside of the render phase
  useEffect(() => {
    // This effect handles the visibility based on the messages array length and current index
    if (messages.length === 0 || currentMessageIndex === messages.length - 1) {
      setShowGuide(false);
    } else {
      setShowGuide(true);
    }
  }, [currentMessageIndex, messages.length, setShowGuide]);

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
