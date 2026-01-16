import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  totalSteps,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;

        const animatedStyle = useAnimatedStyle(() => ({
          backgroundColor: withTiming(
            isActive ? '#2F6B4F' : '#E0E0E0',
            { duration: 300 }
          ),
        }));

        return (
          <Animated.View
            key={index}
            style={[styles.segment, animatedStyle]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  segment: {
    height: 3,
    flex: 1,
    maxWidth: 32,
    borderRadius: 2,
  },
});

export default ProgressBar;
