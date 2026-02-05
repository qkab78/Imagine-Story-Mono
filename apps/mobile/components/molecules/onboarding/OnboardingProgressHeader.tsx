import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
} from 'react-native-reanimated';
import { ProgressBar } from '@/components/atoms/onboarding/ProgressBar';

interface OnboardingProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export const OnboardingProgressHeader: React.FC<OnboardingProgressHeaderProps> = ({
  currentStep,
  totalSteps,
  onClose,
  showCloseButton = true,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.9, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <ProgressBar
          totalSteps={totalSteps}
          currentStep={currentStep}
          variant="header"
        />
      </View>

      {showCloseButton && onClose ? (
        <AnimatedTouchable
          style={[styles.closeButton, buttonAnimatedStyle]}
          onPress={onClose}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.8}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="close" size={24} color="rgba(255, 255, 255, 0.9)" />
        </AnimatedTouchable>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 16,
  },
  progressBarContainer: {
    flex: 1,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 32,
    height: 32,
  },
});

export default OnboardingProgressHeader;
