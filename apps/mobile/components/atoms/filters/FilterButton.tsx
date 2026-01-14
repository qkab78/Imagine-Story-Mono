import { Pressable, View, Text, StyleSheet } from 'react-native';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { SlidersHorizontal } from 'lucide-react-native';
import { useLiquidGlass } from '@/hooks/useLiquidGlass';
import { LIBRARY_COLORS, LIBRARY_DIMENSIONS } from '@/constants/library';

interface FilterButtonProps {
  onPress: () => void;
  activeFiltersCount?: number;
}

export const FilterButton: React.FC<FilterButtonProps> = ({
  onPress,
  activeFiltersCount = 0,
}) => {
  const { hasGlassSupport } = useLiquidGlass();

  const renderIcon = () => {
    if (hasGlassSupport) {
      return (
        <SymbolView
          name={'line.3.horizontal.decrease' as SymbolViewProps['name']}
          size={18}
          tintColor="white"
          weight="medium"
        />
      );
    }

    return <SlidersHorizontal size={18} color="white" />;
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      {renderIcon()}
      {activeFiltersCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{activeFiltersCount}</Text>
        </View>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: LIBRARY_DIMENSIONS.searchButtonSize,
    height: LIBRARY_DIMENSIONS.searchButtonSize,
    borderRadius: LIBRARY_DIMENSIONS.searchButtonBorderRadius,
    backgroundColor: LIBRARY_COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: LIBRARY_COLORS.primaryLight,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: LIBRARY_COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: LIBRARY_COLORS.textPrimary,
  },
});

export default FilterButton;
