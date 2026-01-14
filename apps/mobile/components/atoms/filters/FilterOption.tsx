import { Pressable, View, Text, StyleSheet } from 'react-native';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import {
  PawPrint,
  Search,
  Flame,
  Map,
  BookOpen,
  Heart,
  Home,
  Sparkles,
  Book,
} from 'lucide-react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useLiquidGlass } from '@/hooks/useLiquidGlass';
import { LIBRARY_COLORS, LIBRARY_SPACING } from '@/constants/library';

// Map Lucide icon names to components
const LUCIDE_ICONS: Record<string, React.ComponentType<{ size: number; color: string }>> = {
  PawPrint,
  Search,
  Flame,
  Map,
  BookOpen,
  Heart,
  Home,
  Sparkles,
  Book,
};

interface FilterOptionProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  icon?: {
    sfSymbol: string;
    lucide: string;
  };
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FilterOption: React.FC<FilterOptionProps> = ({
  label,
  isSelected,
  onPress,
  icon,
}) => {
  const scale = useSharedValue(1);
  const { hasGlassSupport } = useLiquidGlass();

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

  const renderIcon = () => {
    if (!icon) return null;

    if (hasGlassSupport) {
      return (
        <SymbolView
          name={icon.sfSymbol as SymbolViewProps['name']}
          size={28}
          tintColor={iconColor}
          weight="medium"
        />
      );
    }

    const LucideIcon = LUCIDE_ICONS[icon.lucide] || Book;
    return <LucideIcon size={28} color={iconColor} />;
  };

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
      <View style={styles.iconContainer}>
        {renderIcon()}
      </View>
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
