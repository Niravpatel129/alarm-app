import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text } from 'react-native';

const GradientText = (props) => {
  const startColor = props.startColor || '#8A2BE2';
  const endColor = props.endColor || '#87CEFA';

  return (
    <MaskedView maskElement={<Text {...props} />}>
      <LinearGradient colors={[startColor, endColor]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
        <Text {...props} style={[props.style, { opacity: 0 }]} />
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
