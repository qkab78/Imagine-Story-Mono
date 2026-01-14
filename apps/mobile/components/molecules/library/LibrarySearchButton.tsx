import React from 'react';
import { Pressable, StyleSheet, Platform } from 'react-native';
import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Search } from 'lucide-react-native';
import { useLiquidGlass } from '@/hooks/useLiquidGlass';
import { LIBRARY_COLORS, LIBRARY_DIMENSIONS } from '@/constants/library';

interface LibrarySearchButtonProps {
  onPress: () => void;
}

export const LibrarySearchButton: React.FC<LibrarySearchButtonProps> = ({ onPress }) => {
  const { hasGlassSupport } = useLiquidGlass();

  const renderIcon = () => {
    if (hasGlassSupport) {
      return (
        <SymbolView
          name={'magnifyingglass' as SymbolViewProps['name']}
          size={18}
          tintColor={LIBRARY_COLORS.textPrimary}
          weight="medium"
        />
      );
    }

    return <Search size={18} color={LIBRARY_COLORS.textPrimary} />;
  };

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={onPress}
    >
      {renderIcon()}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: LIBRARY_DIMENSIONS.searchButtonSize,
    height: LIBRARY_DIMENSIONS.searchButtonSize,
    borderRadius: LIBRARY_DIMENSIONS.searchButtonBorderRadius,
    backgroundColor: `${LIBRARY_COLORS.primary}1A`, // 10% opacity
    alignItems: 'center',
    justifyContent: 'center',
  },
  pressed: {
    backgroundColor: `${LIBRARY_COLORS.primary}26`, // 15% opacity
  },
});

export default LibrarySearchButton;
