import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { LIBRARY_COLORS, LIBRARY_DIMENSIONS } from '@/constants/library';

interface ProgressBarProps {
  progress: number; // 0-100
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, animated = true }) => {
  const animatedProgress = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      animatedProgress.value = withTiming(progress, {
        duration: 300,
        easing: Easing.out(Easing.ease),
      });
    } else {
      animatedProgress.value = progress;
    }
  }, [progress, animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${animatedProgress.value}%`,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.fill, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: LIBRARY_DIMENSIONS.progressBarHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: LIBRARY_COLORS.accent,
  },
});

export default ProgressBar;
