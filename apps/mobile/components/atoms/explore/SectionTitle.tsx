import { View, Text, Pressable, StyleSheet } from 'react-native';
import { DualIcon } from '@/components/ui/DualIcon';
import {
  EXPLORE_COLORS,
  EXPLORE_SPACING,
  EXPLORE_TYPOGRAPHY,
  EXPLORE_ICONS,
} from '@/constants/explore';

interface SectionTitleProps {
  title: string;
  emoji?: string;
  showSeeAll?: boolean;
  onSeeAll?: () => void;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  emoji,
  showSeeAll = false,
  onSeeAll,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        {emoji && <Text style={styles.emoji}>{emoji}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>

      {showSeeAll && onSeeAll && (
        <Pressable onPress={onSeeAll} style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Voir tout</Text>
          <DualIcon
            icon={EXPLORE_ICONS.chevronRight}
            size={14}
            color={EXPLORE_COLORS.primary}
          />
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: EXPLORE_SPACING.xl,
    marginBottom: EXPLORE_SPACING.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EXPLORE_SPACING.sm,
  },
  emoji: {
    fontSize: 20,
  },
  title: {
    fontSize: EXPLORE_TYPOGRAPHY.sectionTitle.fontSize,
    fontWeight: EXPLORE_TYPOGRAPHY.sectionTitle.fontWeight,
    fontFamily: 'Quicksand',
    color: EXPLORE_COLORS.textPrimary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EXPLORE_SPACING.xs,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.primary,
  },
});

export default SectionTitle;
