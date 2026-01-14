import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
import { getThemeGradient, getThemeIcons } from '@/types/library';
import { LIBRARY_DIMENSIONS, LIBRARY_COLORS } from '@/constants/library';
import { useLiquidGlass } from '@/hooks/useLiquidGlass';

interface StoryCoverPlaceholderProps {
  themeName: string;
  size?: number;
}

// Map des icônes Lucide
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

export const StoryCoverPlaceholder: React.FC<StoryCoverPlaceholderProps> = ({
  themeName,
  size = LIBRARY_DIMENSIONS.emojiSize,
}) => {
  const { hasGlassSupport } = useLiquidGlass();
  const gradient = getThemeGradient(themeName);
  const icons = getThemeIcons(themeName);

  const renderIcon = () => {
    // iOS avec Liquid Glass -> SF Symbols
    if (hasGlassSupport) {
      return (
        <SymbolView
          name={icons.sfSymbol as SymbolViewProps['name']}
          size={size}
          tintColor={LIBRARY_COLORS.textSecondary}
          weight="medium"
        />
      );
    }

    // Fallback -> Lucide icons
    const LucideIcon = LUCIDE_ICONS[icons.lucide] || LUCIDE_ICONS.Book;
    return <LucideIcon size={size} color={LIBRARY_COLORS.textSecondary} />;
  };

  return (
    <LinearGradient
      colors={gradient}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.iconContainer}>{renderIcon()}</View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: LIBRARY_DIMENSIONS.cardCoverHeight,
    borderTopLeftRadius: LIBRARY_DIMENSIONS.cardBorderRadius,
    borderTopRightRadius: LIBRARY_DIMENSIONS.cardBorderRadius,
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StoryCoverPlaceholder;
