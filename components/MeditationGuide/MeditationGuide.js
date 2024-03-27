import React, { useEffect, useState } from 'react';
import { Animated, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import GradientText from '../GradientText/GradientText';

const MeditationGuide = ({ messages = ['Sleep is luxury'], onCompletion, messageTitle }) => {
  if (!messages) {
    console.error('MeditationGuide: No messages provided');
    return null;
  }

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const opacity = new Animated.Value(0);
  const scale = new Animated.Value(0.8);
  const tapToContinueOpacity = new Animated.Value(0);
  const words = messages[currentMessageIndex].split(' ');

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      const timer = setTimeout(() => {
        Animated.timing(tapToContinueOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 2000);
      return () => clearTimeout(timer);
    });
  }, [currentMessageIndex, opacity, scale, tapToContinueOpacity]);

  const animatedStyles = {
    opacity: opacity,
    transform: [{ scale: scale }],
  };

  const tapToContinueAnimatedStyle = {
    opacity: tapToContinueOpacity,
  };

  const goToNextMessage = () => {
    // if there are no more messages, call onCompletion
    if (currentMessageIndex === messages.length - 1) {
      // fade out the message
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0.8,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        tapToContinueOpacity.setValue(0);
        onCompletion();
      });
      return;
    }

    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start(() => {
      tapToContinueOpacity.setValue(0);
      if (currentMessageIndex < messages.length - 1) {
        setCurrentMessageIndex(currentMessageIndex + 1);
        setTimeout(() => {
          opacity.setValue(0);
          scale.setValue(0.8);
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
          ]).start();
        }, 100);
      }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={{
          flex: 1,
        }}
        onPress={goToNextMessage}
      >
        <View
          style={{
            marginBottom: 'auto',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 14,
              fontWeight: 'bold',
              color: 'white',
              opacity: 0.2,
            }}
          >
            {messageTitle} ({currentMessageIndex + 1}/{messages.length})
          </Text>
        </View>

        <Animated.View style={[styles.messageContainer, animatedStyles]}>
          <GradientText
            style={{
              fontSize: 30,
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              fontFamily: 'Avenir-Black',
              letterSpacing: 1,
            }}
          >
            {words.map((word, index) => (
              <Animated.Text
                key={index}
                style={{
                  opacity: opacity.interpolate({
                    inputRange: [0, 0.8, 1],
                    outputRange: [0, 0, 1],
                    extrapolate: 'clamp',
                  }),
                }}
              >
                {word}{' '}
              </Animated.Text>
            ))}
          </GradientText>
        </Animated.View>
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
      </Pressable>
    </SafeAreaView>
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
    padding: 10,
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
});

export default MeditationGuide;
