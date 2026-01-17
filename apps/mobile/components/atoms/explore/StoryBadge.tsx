import { View, Text, StyleSheet } from 'react-native';
import { EXPLORE_COLORS, EXPLORE_SPACING, EXPLORE_TYPOGRAPHY } from '@/constants/explore';

type BadgeType = 'new' | 'popular' | 'featured';

interface StoryBadgeProps {
  type: BadgeType;
}

const BADGE_CONFIG: Record<BadgeType, { label: string; backgroundColor: string; textColor: string }> = {
  new: {
    label: 'NOUVEAU',
    backgroundColor: EXPLORE_COLORS.badgeNew,
    textColor: EXPLORE_COLORS.textLight,
  },
  popular: {
    label: 'POPULAIRE',
    backgroundColor: EXPLORE_COLORS.badgePopular,
    textColor: EXPLORE_COLORS.textPrimary,
  },
  featured: {
    label: 'Histoire du jour',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    textColor: EXPLORE_COLORS.textLight,
  },
};

export const StoryBadge: React.FC<StoryBadgeProps> = ({ type }) => {
  const config = BADGE_CONFIG[type];

  return (
    <View style={[styles.badge, { backgroundColor: config.backgroundColor }]}>
      <Text style={[styles.text, { color: config.textColor }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: EXPLORE_SPACING.sm,
    paddingVertical: EXPLORE_SPACING.xs,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: EXPLORE_TYPOGRAPHY.badge.fontSize,
    fontWeight: EXPLORE_TYPOGRAPHY.badge.fontWeight,
    fontFamily: 'Nunito',
    letterSpacing: 0.5,
  },
});

export default StoryBadge;
