import { Pressable, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { DualIcon, type IconConfig } from '@/components/ui';
import { LIBRARY_COLORS, LIBRARY_SPACING } from '@/constants/library';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: IconConfig;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FilterChip: React.FC<FilterChipProps> = ({
  label,
  isSelected,
  onPress,
  icon,
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

  const iconColor = isSelected ? LIBRARY_COLORS.primary : LIBRARY_COLORS.textSecondary;

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
      {icon && (
        <View style={styles.iconContainer}>
          <DualIcon icon={icon} size={16} color={iconColor} />
        </View>
      )}
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    paddingHorizontal: LIBRARY_SPACING.lg,
    paddingVertical: LIBRARY_SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: LIBRARY_SPACING.xs,
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
  iconContainer: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
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
