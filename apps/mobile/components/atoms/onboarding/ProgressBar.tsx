import { View, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
  variant?: 'default' | 'header';
}

const COLORS = {
  active: '#2F6B4F',
  completed: '#2F6B4F',
  inactive: '#E0E0E0',
  inactiveHeader: 'rgba(255, 255, 255, 0.4)',
  activeHeader: 'rgba(255, 255, 255, 0.95)',
};

const ProgressSegment = ({
  index,
  currentStep,
  variant,
}: {
  index: number;
  currentStep: number;
  variant: 'default' | 'header';
}) => {
  const isCompleted = index < currentStep;
  const isActive = index === currentStep;

  const animatedStyle = useAnimatedStyle(() => {
    let backgroundColor: string;

    if (variant === 'header') {
      backgroundColor = isCompleted || isActive
        ? COLORS.activeHeader
        : COLORS.inactiveHeader;
    } else {
      backgroundColor = isCompleted || isActive
        ? COLORS.active
        : COLORS.inactive;
    }

    return {
      backgroundColor: withTiming(backgroundColor, { duration: 300 }),
    };
  });

  return (
    <Animated.View
      style={[
        variant === 'header' ? styles.segmentHeader : styles.segment,
        animatedStyle,
      ]}
    />
  );
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  totalSteps,
  currentStep,
  variant = 'default',
}) => {
  return (
    <View style={variant === 'header' ? styles.containerHeader : styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <ProgressSegment
          key={index}
          index={index}
          currentStep={currentStep}
          variant={variant}
        />
      ))}
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
  containerHeader: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  segment: {
    height: 3,
    flex: 1,
    maxWidth: 32,
    borderRadius: 2,
  },
  segmentHeader: {
    height: 4,
    flex: 1,
    borderRadius: 2,
  },
});

export default ProgressBar;
