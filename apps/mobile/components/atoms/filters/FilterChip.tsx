import { Pressable, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LIBRARY_COLORS, LIBRARY_SPACING } from '@/constants/library';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isSelected,
  onPress,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[
        styles.container,
        animatedStyle,
        isSelected && styles.selected,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: LIBRARY_SPACING.lg,
    paddingVertical: LIBRARY_SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selected: {
    backgroundColor: 'white',
    borderColor: LIBRARY_COLORS.accent,
    shadowColor: LIBRARY_COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: LIBRARY_COLORS.textSecondary,
  },
  labelSelected: {
    color: LIBRARY_COLORS.textPrimary,
    fontWeight: '700',
  },
});

export default FilterChip;
