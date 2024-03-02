import React, { useEffect, useState } from 'react'; // Import useEffect
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import GradientText from '../GradientText/GradientText';

const MeditationGuide = ({ messages, onCompletion }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const opacity = useSharedValue(1);
  const tapToContinueOpacity = useSharedValue(0); // Shared value for controlling the "Tap to continue" text opacity

  useEffect(() => {
    const timer = setTimeout(() => {
      tapToContinueOpacity.value = 1; // Fade in the "Tap to continue" text after an additional delay
    }, 3000); // Delay for the "Tap to continue" text to appear
    return () => clearTimeout(timer); // Cleanup the timer when component unmounts or currentMessageIndex changes
  }, [currentMessageIndex]); // Dependency array includes currentMessageIndex to trigger the effect on change

  const animatedStyles = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 700,
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  const tapToContinueAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(tapToContinueOpacity.value, {
        duration: 500, // Slightly faster to make it more responsive
        easing: Easing.inOut(Easing.ease),
      }),
    };
  });

  const goToNextMessage = () => {
    opacity.value = 0; // Start fading out the current message
    tapToContinueOpacity.value = 0; // Also start fading out the "Tap to continue" text
    if (currentMessageIndex < messages.length - 1) {
      setTimeout(() => {
        setCurrentMessageIndex(currentMessageIndex + 1); // Update the message index to the next message
        setTimeout(() => {
          opacity.value = 1; // Start fading in the next message after the index has been updated
        }, 100); // Short delay to ensure the index is updated before starting to fade in
      }, 700); // Match this delay with the duration of the fade-out animation
    } else {
      setTimeout(onCompletion, 700); // If at the last message, call completion handler after the fade-out animation
    }
  };

  return (
    <Pressable style={styles.container} onPress={goToNextMessage}>
      <Animated.View style={[styles.messageContainer, animatedStyles]}>
        <View
          style={{
            marginBottom: 'auto',
          }}
        >
          <GradientText
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'white',
            }}
          >
            Sleep Guide ({currentMessageIndex + 1}/{messages.length})
          </GradientText>
        </View>

        <GradientText
          style={{
            fontSize: 36,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
          }}
        >
          {messages[currentMessageIndex]}
        </GradientText>
        <Animated.View
          style={[
            {
              marginTop: 'auto',
            },
            tapToContinueAnimatedStyle,
          ]}
        >
          <GradientText
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
            }}
          >
            - Tap to continue -
          </GradientText>
        </Animated.View>
      </Animated.View>
    </Pressable>
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
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
});

export default MeditationGuide;
