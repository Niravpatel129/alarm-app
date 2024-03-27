import React, { useEffect, useState } from 'react';
import { Animated, Pressable, SafeAreaView, Text, View } from 'react-native';
import GradientText from '../GradientText/GradientText';
import styles from './styles';

const MeditationGuide = ({
  messages = ['Sleep is luxury'],
  onCompletion,
  messageTitle,
  lastMessageGradient = { start: '#000', end: '#fff' }, // Example gradient prop
  lastMessageFontSize = 30, // Larger font size for the last message
}) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const opacity = useState(new Animated.Value(0))[0];
  const scale = useState(new Animated.Value(0.8))[0];
  const tapToContinueOpacity = useState(new Animated.Value(0))[0];
  const lines = messages[currentMessageIndex].split('\n\n');
  const [lineAnimations, setLineAnimations] = useState([]);

  useEffect(() => {
    setLineAnimations(lines.map(() => new Animated.Value(0)));
  }, [currentMessageIndex, messages]);

  useEffect(() => {
    const animateIn = () => {
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
        Animated.stagger(
          1600,
          lineAnimations.map((animation, index) =>
            Animated.sequence([
              Animated.timing(animation, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
              }),
              Animated.timing(animation, {
                toValue: index === lineAnimations.length - 1 ? 1 : 0,
                duration: 1000,
                useNativeDriver: true,
              }),
            ]),
          ),
        ),
      ]).start(() => {
        setTimeout(() => {
          Animated.timing(tapToContinueOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 4000);
      });
    };

    if (lineAnimations.length > 0) {
      animateIn();
    }

    return () => {
      opacity.setValue(0);
      scale.setValue(0.8);
      tapToContinueOpacity.setValue(0);
      lineAnimations.forEach((animation) => animation.setValue(0));
    };
  }, [currentMessageIndex, messages, lineAnimations]);

  const animatedStyles = {
    opacity: opacity,
    transform: [{ scale: scale }],
  };

  const tapToContinueAnimatedStyle = {
    opacity: tapToContinueOpacity,
  };

  const goToNextMessage = () => {
    tapToContinueOpacity.setValue(0);

    if (currentMessageIndex === messages.length - 1) {
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
      <Pressable style={{ flex: 1 }} onPress={goToNextMessage}>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: 'bold', color: 'white', opacity: 0.2 }}>
            {messageTitle} ({currentMessageIndex + 1}/{messages.length})
          </Text>
        </View>
        <Animated.View style={[styles.messageContainer, animatedStyles]}>
          {lines.map((line, index) => {
            const startColor = index === lines.length - 1 ? '#5e46bc' : '#333';
            const endColor = index === lines.length - 1 ? '#b006db' : '#eee';

            return (
              <Animated.View
                key={index}
                style={{ opacity: lineAnimations[index], marginBottom: 0 }}
              >
                <GradientText
                  startColor={startColor}
                  endColor={endColor}
                  style={{
                    fontSize: index === lines.length - 1 ? lastMessageFontSize : 30,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                    fontFamily: 'Avenir-Black',
                    letterSpacing: 1,
                  }}
                  start={index === lines.length - 1 ? lastMessageGradient.start : undefined} // Start color of gradient for the last message
                  end={index === lines.length - 1 ? lastMessageGradient.end : undefined} // End color of gradient for the last message
                >
                  {line}
                </GradientText>
              </Animated.View>
            );
          })}
        </Animated.View>
        <Animated.View style={[{ marginTop: 'auto' }, tapToContinueAnimatedStyle]}>
          <GradientText
            style={{ fontSize: 14, fontWeight: 'bold', color: 'white', textAlign: 'center' }}
          >
            - Tap to continue -
          </GradientText>
        </Animated.View>
      </Pressable>
    </SafeAreaView>
  );
};

export default MeditationGuide;
