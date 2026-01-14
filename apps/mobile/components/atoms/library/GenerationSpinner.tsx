import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LIBRARY_DIMENSIONS } from '@/constants/library';

interface GenerationSpinnerProps {
  size?: number;
  color?: string;
  borderWidth?: number;
}

export const GenerationSpinner: React.FC<GenerationSpinnerProps> = ({
  size = LIBRARY_DIMENSIONS.spinnerSize,
  color = 'white',
  borderWidth = 3,
}) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1, // Infinite repeat
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      style={[
        styles.spinner,
        animatedStyle,
        {
          width: size,
          height: size,
          borderWidth,
          borderColor: `${color}30`, // 30% opacity
          borderTopColor: color,
          borderRadius: size / 2,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  spinner: {
    // Base styles are applied via props
  },
});

export default GenerationSpinner;
