import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DualIcon } from '@/components/ui/DualIcon';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { EXPLORE_COLORS, EXPLORE_SPACING, EXPLORE_DIMENSIONS } from '@/constants/explore';
import type { PopularTheme } from '@/types/explore';

interface ThemeCardProps {
  theme: PopularTheme;
  onPress: () => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onPress }) => {
  const { t } = useAppTranslation('stories');

  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={theme.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.iconContainer}>
          <DualIcon
            icon={{ sfSymbol: theme.icon.sfSymbol, lucide: theme.icon.lucide }}
            size={28}
            color={EXPLORE_COLORS.textLight}
          />
        </View>
        <Text style={styles.name}>{theme.name}</Text>
        <Text style={styles.count}>
          {theme.storyCount === 1
            ? t('card.storyCount', { count: theme.storyCount })
            : t('card.storiesCount', { count: theme.storyCount })}
        </Text>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    minWidth: EXPLORE_DIMENSIONS.themeCardMinWidth,
    height: EXPLORE_DIMENSIONS.themeCardHeight,
    borderRadius: 16,
    padding: EXPLORE_SPACING.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: EXPLORE_SPACING.xs,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Quicksand',
    color: EXPLORE_COLORS.textLight,
    marginBottom: 2,
  },
  count: {
    fontSize: 11,
    fontFamily: 'Nunito',
    color: 'rgba(255, 255, 255, 0.8)',
  },
});

export default ThemeCard;
