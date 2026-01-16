import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

type NavigationButtonVariant = 'back' | 'next' | 'primary';

interface NavigationButtonProps {
  variant: NavigationButtonVariant;
  onPress: () => void;
  disabled?: boolean;
  label?: string;
}

export const NavigationButton: React.FC<NavigationButtonProps> = ({
  variant,
  onPress,
  disabled = false,
  label,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 200 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 200 });
  };

  if (variant === 'primary') {
    return (
      <AnimatedTouchable
        style={[styles.primaryButton, animatedStyle, disabled && styles.disabled]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        activeOpacity={0.9}
      >
        <Text style={styles.primaryButtonText}>{label || 'Continuer'}</Text>
      </AnimatedTouchable>
    );
  }

  const isBack = variant === 'back';
  const buttonStyle = isBack ? styles.backButton : styles.nextButton;

  return (
    <AnimatedTouchable
      style={[styles.iconButton, buttonStyle, animatedStyle, disabled && styles.disabled]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.9}
    >
      {isBack ? (
        <ChevronLeft size={20} color="#424242" />
      ) : (
        <ChevronRight size={20} color="#FFFFFF" />
      )}
    </AnimatedTouchable>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButton: {
    backgroundColor: '#F5F5F5',
  },
  nextButton: {
    backgroundColor: '#1F3D2B',
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#1F3D2B',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
});

export default NavigationButton;
