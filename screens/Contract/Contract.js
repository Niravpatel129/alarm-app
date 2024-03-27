import React, { useEffect, useRef } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const bubbleCount = 20;

const AgreementScreen = ({ message }) => {
  const scaleAnimation = useSharedValue(0);
  const progressAnimation = useSharedValue(0);
  const holdDuration = 2000; // Hold duration in milliseconds
  const bubblePositions = useRef(
    Array.from({ length: bubbleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
    })),
  ).current;

  const scaleAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleAnimation.value }],
    };
  });

  const progressAnimatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progressAnimation.value * 100}%`,
    };
  });

  const bubbleAnimatedStyles = bubblePositions.map((_, index) => {
    const offsetX = useSharedValue(Math.random() * width);
    const offsetY = useSharedValue(Math.random() * height);
    const scale = useSharedValue(1);

    return useAnimatedStyle(() => {
      return {
        position: 'absolute',
        left: offsetX.value,
        top: offsetY.value,
        transform: [{ scale: scale.value }],
      };
    });
  });

  useEffect(() => {
    scaleAnimation.value = withDelay(
      1000,
      withRepeat(
        withSequence(
          withTiming(1.2, { duration: 500, easing: Easing.ease }),
          withTiming(1, { duration: 500, easing: Easing.ease }),
        ),
        -1,
        true,
      ),
    );
  }, []);

  const handleHoldStart = () => {
    console.log('Hold started');

    progressAnimation.value = withTiming(1, { duration: holdDuration });
    bubblePositions.forEach((_, index) => {
      const offsetX = bubbleAnimatedStyles[index].offsetX;
      const offsetY = bubbleAnimatedStyles[index].offsetY;
      const scale = bubbleAnimatedStyles[index].scale;

      offsetX.value = withTiming(width / 2, { duration: holdDuration });
      offsetY.value = withTiming(height / 2, { duration: holdDuration });
      scale.value = withTiming(0, { duration: holdDuration });
    });
  };

  const handleHoldEnd = () => {
    if (progressAnimation.value === 1) {
      // Agreement completed
      console.log('Agreement completed!');
    } else {
      // Agreement interrupted
      progressAnimation.value = withTiming(0, { duration: 300 });
      bubblePositions.forEach((_, index) => {
        const offsetX = bubbleAnimatedStyles[index].offsetX;
        const offsetY = bubbleAnimatedStyles[index].offsetY;
        const scale = bubbleAnimatedStyles[index].scale;

        offsetX.value = withTiming(bubblePositions[index].x, { duration: 300 });
        offsetY.value = withTiming(bubblePositions[index].y, { duration: 300 });
        scale.value = withTiming(1, { duration: 300 });
      });
    }
  };

  return (
    <View style={styles.container}>
      <Animated.Text style={[styles.message, scaleAnimatedStyle]}>{message}</Animated.Text>
      <PanGestureHandler
        onHandlerStateChange={useAnimatedGestureHandler({
          onActive: () => runOnJS(handleHoldStart)(),
          onEnd: () => runOnJS(handleHoldEnd)(),
        })}
      >
        <Animated.View style={styles.agreementButton}>
          <Text style={styles.agreementText}>Hold to Agree</Text>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressAnimatedStyle]} />
          </View>
        </Animated.View>
      </PanGestureHandler>
      {bubblePositions.map((_, index) => (
        <Animated.View key={index} style={[styles.bubble, bubbleAnimatedStyles[index]]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  agreementButton: {
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  agreementText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginTop: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
  },
  bubble: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 122, 255, 0.3)',
  },
});

export default AgreementScreen;
