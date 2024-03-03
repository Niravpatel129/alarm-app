import React from 'react';
import { Dimensions, StyleSheet, Text } from 'react-native';
import Animated, { Extrapolate, interpolate, useAnimatedStyle } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const data = [
  'Screen 1 Content',
  'Screen 2 Content',
  'Screen 3 Content',
  'Screen 4 Content',
  'Screen 5 Content',
  'Screen 6 Content',
  'Screen 7 Content',
  'Screen 8 Content',
  'Screen 9 Content',
];

const colors = ['#fda282', '#fdba4e', '#800015']; // Example colors, adjust as needed

const OnboardingScreen = ({ navigation }) => {
  const renderItem = ({ index, animationValue }) => (
    <Card animationValue={animationValue} index={index} />
  );

  return (
    <Carousel
      loop={false}
      width={windowWidth}
      height={windowHeight * 0.75} // Adjust the height as needed
      data={data}
      renderItem={renderItem}
      onSnapToItem={(index) => {
        if (index === data.length - 1) {
          // Optionally navigate to another screen after the last slide
          navigation.navigate('Home');
        }
      }}
    />
  );
};

const Card = ({ index, animationValue }) => {
  const cardStyle = useAnimatedStyle(() => {
    const scale = interpolate(animationValue.value, [-0.1, 0, 1], [0.95, 1, 1], Extrapolate.CLAMP);
    const rotate = interpolate(animationValue.value, [-1, 0, 1], [-30, 0, 30], Extrapolate.CLAMP);

    return {
      transform: [{ scale }, { rotate: `${rotate}deg` }],
      width: windowWidth, // Adjust card width as needed
      height: windowHeight * 0.75, // Adjust card height as needed
      justifyContent: 'center',
      alignItems: 'center',
    };
  });

  return (
    <Animated.View style={[styles.slide, cardStyle]}>
      <Text style={styles.slideText}>{data[index]}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth,
  },
  slideText: {
    fontSize: 24,
    textAlign: 'center',
  },
});

export default OnboardingScreen;
