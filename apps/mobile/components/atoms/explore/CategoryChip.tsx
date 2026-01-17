import { Pressable, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  EXPLORE_COLORS,
  EXPLORE_SPACING,
  EXPLORE_TYPOGRAPHY,
} from '@/constants/explore';
import type { ExploreCategory } from '@/types/explore';

interface CategoryChipProps {
  category: ExploreCategory;
  isActive: boolean;
  onPress: () => void;
}

export const CategoryChip: React.FC<CategoryChipProps> = ({
  category,
  isActive,
  onPress,
}) => {
  if (isActive) {
    return (
      <Pressable onPress={onPress}>
        <LinearGradient
          colors={[EXPLORE_COLORS.chipActiveStart, EXPLORE_COLORS.chipActiveEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.chip}
        >
          <Text style={styles.emoji}>{category.emoji}</Text>
          <Text style={[styles.text, styles.activeText]}>{category.name}</Text>
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={[styles.chip, styles.inactiveChip]}>
      <Text style={styles.emoji}>{category.emoji}</Text>
      <Text style={[styles.text, styles.inactiveText]}>{category.name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: EXPLORE_SPACING.lg,
    paddingVertical: EXPLORE_SPACING.sm,
    borderRadius: 20,
    gap: EXPLORE_SPACING.xs,
  },
  inactiveChip: {
    backgroundColor: EXPLORE_COLORS.chipInactive,
    borderWidth: 1,
    borderColor: 'rgba(47, 107, 79, 0.15)',
  },
  emoji: {
    fontSize: 14,
  },
  text: {
    fontSize: EXPLORE_TYPOGRAPHY.chipText.fontSize,
    fontWeight: EXPLORE_TYPOGRAPHY.chipText.fontWeight,
    fontFamily: 'Nunito',
  },
  activeText: {
    color: EXPLORE_COLORS.textLight,
  },
  inactiveText: {
    color: EXPLORE_COLORS.textPrimary,
  },
});

export default CategoryChip;
