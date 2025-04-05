import { Dimensions } from 'react-native'
import React from 'react'
import Animated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useTheme } from '@shopify/restyle';
import { Theme } from '@/config/theme';

type DotProps = {
  index: number;
  currentIndex: SharedValue<number>;
}

const { width } = Dimensions.get('window');

const Dot = ({ index, currentIndex }: DotProps) => {
  const theme = useTheme<Theme>();
  
  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      currentIndex.value / width, 
      [index - 1, index, index + 1], 
      [0.5, 1, 0.5], 
      "clamp"
    );
    
    const scale = interpolate(
      currentIndex.value / width, 
      [index - 1, index, index + 1], 
      [1, 1.25, 1], 
      "clamp"
    );
    
    return {
      opacity,
      transform: [{ scale }]
    };
  });

  return (
    <Animated.View style={[
      {
        backgroundColor: theme.colors.blue,
        width: 10,
        height: 10,
        borderRadius: 5,
      },
      animatedStyle
    ]} />
  )
}

export default Dot