import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const data = [
  {
    title: 'Welcome',
    description:
      'Welcome to ZenWake, your serene start to the day. Let’s get ready to wake up refreshed every morning.',
  },
  {
    title: 'Set Your First Alarm',
    description:
      'Choose a time to wake up and select a soothing Zen sound to start your day peacefully.',
  },
  {
    title: 'Discover Zen Sounds',
    description:
      'Explore a variety of calming sounds for your alarms, from gentle rains to soft chimes.',
  },
  {
    title: 'Personalize Your Morning',
    description: 'Customize how you wake up by setting multiple alarms for different days.',
  },
  {
    title: 'Zen Tools for Better Sleep',
    description: 'Use our bedtime reminder and guided meditations to prepare for a restful night.',
  },
  {
    title: 'Track Your Sleep',
    description:
      'Understand your sleep patterns with our insights to improve your sleep quality over time.',
  },
  {
    title: 'Stay Mindful',
    description: 'Set daily mindfulness reminders to take moments of peace throughout your day.',
  },
  {
    title: 'Join Our Community',
    description:
      'Share tips, experiences, and support with others on their journey to better sleep and mornings.',
  },
  {
    title: 'You’re All Set',
    description:
      'Start your ZenWake journey to a more peaceful morning and a restful night’s sleep.',
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
    const scale = interpolate(animationValue.value, [-1, 0, 1], [0.9, 1, 1.1], Extrapolate.CLAMP);
    const opacity = interpolate(animationValue.value, [-1, 0, 1], [0.5, 1, 0.5], Extrapolate.CLAMP);
    const translateX = interpolate(
      animationValue.value,
      [-1, 0, 1],
      [-30, 0, 30],
      Extrapolate.CLAMP,
    );

    return {
      opacity,
      transform: [{ scale }, { translateX }],
    };
  });

  const { title, description } = data[index];

  return (
    <Animated.View style={[styles.slide, cardStyle]}>
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
    height: windowHeight,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, // Ensure text does not touch the edges
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
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 20,
  },
  skipButtonText: {
    fontSize: 16,
    color: '#333',
  },
});

export default OnboardingScreen;
