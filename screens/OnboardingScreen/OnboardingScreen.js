import LottieView from 'lottie-react-native';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const data = [
  {
    title: 'Welcome',
    description: 'Welcome to ZenWake, your serene start to the day...',
    image: require('../../assets/monk.png'),
  },
  {
    title: 'Set Your First Alarm',
    description: 'Choose a time to wake up and select a soothing Zen sound...',
    image: require('../../assets/monk.png'),
  },
  {
    title: 'Set Your First Alarm',
    description: 'Choose a time to wake up and select a soothing Zen sound...',
    image: require('../../assets/monk.png'),
  },
  {
    title: 'Set Your First Alarm',
    description: 'Choose a time to wake up and select a soothing Zen sound...',
    image: require('../../assets/monk.png'),
  },
  {
    title: 'Set Your First Alarm',
    description: 'Choose a time to wake up and select a soothing Zen sound...',
    image: require('../../assets/monk.png'),
  },
];

const OnboardingScreen = ({ navigation }) => {
  const renderItem = ({ index, animationValue }) => (
    <Card animationValue={animationValue} index={index} />
  );

  return (
    <View style={styles.fullScreen}>
      <Carousel
        loop={false}
        width={windowWidth}
        height={windowHeight}
        data={data}
        renderItem={renderItem}
        onSnapToItem={(index) => {
          if (index === data.length - 1) {
            navigation.navigate('Home');
          }
        }}
      />
      <TouchableOpacity onPress={() => navigation.navigate('Home')} style={styles.skipButton}>
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>
    </View>
  );
};

const Card = ({ index, animationValue }) => {
  const cardStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationValue.value, [-1, 0, 1], [0.8, 1, 1.2], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const opacity = interpolate(animationValue.value, [-1, 0, 1], [0.5, 1, 0.5], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const translateX = interpolate(animationValue.value, [-1, 0, 1], [-50, 0, 50], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

    return {
      opacity,
      transform: [{ scale }, { translateX }],
    };
  });

  const imageStyle = useAnimatedStyle(() => {
    const translateX = interpolate(animationValue.value, [-1, 0, 1], [-30, 0, 30], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return {
      transform: [{ translateX }],
    };
  });

  const { title, description, image } = data[index];

  return (
    <Animated.View style={[styles.slide, cardStyle]}>
      <Animated.View style={styles.slideImage}>
        <LottieView
          autoPlay
          style={
            ([
              {
                width: 600,
                height: 600,
              },
            ],
            styles.slideImage)
          }
          source={require('./lottie/1.json')}
        />
      </Animated.View>
      <Text style={styles.slideTitle}>{title}</Text>
      <Text style={styles.slideText}>{description}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0ede5',
  },
  slide: {
    width: windowWidth,
    height: windowHeight * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    padding: 20,
  },
  slideImage: {
    width: windowWidth,
    height: 300,
  },
  slideTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    paddingBottom: 10,
  },
  slideText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 10,
    padding: 20,
  },
  skipButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    padding: 30,
    borderRadius: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default OnboardingScreen;
