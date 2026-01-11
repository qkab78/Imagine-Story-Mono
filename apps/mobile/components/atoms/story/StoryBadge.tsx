import React from 'react';
import { StyleSheet, View } from 'react-native';
import Text from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface StoryBadgeProps {
  label: string;
  emoji?: string;
  variant?: 'default' | 'primary' | 'secondary';
}

export const StoryBadge: React.FC<StoryBadgeProps> = ({ 
  label, 
  emoji,
  variant = 'default' 
}) => {
  const variantStyles = {
    default: styles.badgeDefault,
    primary: styles.badgePrimary,
    secondary: styles.badgeSecondary,
  };

  return (
    <View style={[styles.badge, variantStyles[variant]]}>
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  badgeDefault: {
    backgroundColor: colors.cardBackground,
  },
  badgePrimary: {
    backgroundColor: colors.primaryPink,
    borderColor: colors.primaryPink,
  },
  badgeSecondary: {
    backgroundColor: colors.secondaryOrange,
    borderColor: colors.secondaryOrange,
  },
  emoji: {
    fontSize: typography.fontSize.sm,
    marginRight: spacing.xs,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '600',
    color: colors.textSecondary,
  },
});

export default StoryBadge;
