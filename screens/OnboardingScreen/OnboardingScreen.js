import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width: windowWidth } = Dimensions.get('window');

const data = ['Screen 1 Content', 'Screen 2 Content', 'Screen 3 Content'];

const OnboardingScreen = ({ navigation }) => {
  return (
    <Carousel
      loop={false}
      width={windowWidth}
      data={data}
      renderItem={({ item }) => (
        <View style={styles.slide}>
          <Text style={styles.slideText}>{item}</Text>
        </View>
      )}
      onSnapToItem={(index) => {
        if (index === data.length - 1) {
          // Optionally navigate to another screen after the last slide
          navigation.navigate('Home');
        }
      }}
    />
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
