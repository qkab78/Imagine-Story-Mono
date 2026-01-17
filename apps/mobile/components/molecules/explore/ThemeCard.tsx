import { Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { EXPLORE_COLORS, EXPLORE_SPACING, EXPLORE_DIMENSIONS } from '@/constants/explore';
import type { PopularTheme } from '@/types/explore';

interface ThemeCardProps {
  theme: PopularTheme;
  onPress: () => void;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ theme, onPress }) => {
  return (
    <Pressable onPress={onPress}>
      <LinearGradient
        colors={theme.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Text style={styles.emoji}>{theme.emoji}</Text>
        <Text style={styles.name}>{theme.name}</Text>
        <Text style={styles.count}>{theme.storyCount} histoires</Text>
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
  emoji: {
    fontSize: 28,
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
