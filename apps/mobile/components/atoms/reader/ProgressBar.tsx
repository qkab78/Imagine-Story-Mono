import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { READER_COLORS, READER_DIMENSIONS } from '@/constants/reader';

interface ProgressBarProps {
  progress: number; // 0-100
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  const animatedStyle = useAnimatedStyle(() => ({
    width: withTiming(`${clampedProgress}%`, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    }),
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.fill, animatedStyle]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: READER_DIMENSIONS.progressBarHeight,
    width: READER_DIMENSIONS.progressBarWidth,
    backgroundColor: READER_COLORS.progressBackground,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: READER_COLORS.accent,
    borderRadius: 2,
  },
});

export default ProgressBar;
