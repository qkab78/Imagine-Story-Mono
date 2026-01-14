import { Pressable, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { DualIcon, type IconConfig } from '@/components/ui';
import { LIBRARY_COLORS, LIBRARY_SPACING } from '@/constants/library';

interface FilterOptionProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: IconConfig;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FilterOption: React.FC<FilterOptionProps> = ({
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
          <DualIcon icon={icon} size={28} color={iconColor} />
        </View>
      )}
      <Text style={[styles.label, isSelected && styles.labelSelected]} numberOfLines={2}>
        {label}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    padding: LIBRARY_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 100,
  },
  selected: {
    backgroundColor: 'white',
    borderColor: LIBRARY_COLORS.accent,
    shadowColor: LIBRARY_COLORS.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 4,
  },
  iconContainer: {
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: LIBRARY_SPACING.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: LIBRARY_COLORS.textSecondary,
    textAlign: 'center',
  },
  labelSelected: {
    color: LIBRARY_COLORS.textPrimary,
    fontWeight: '700',
  },
});

export default FilterOption;
