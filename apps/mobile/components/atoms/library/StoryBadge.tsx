import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LIBRARY_COLORS, LIBRARY_DIMENSIONS, LIBRARY_TYPOGRAPHY } from '@/constants/library';

type BadgeVariant = 'new' | 'generating' | 'error';

interface StoryBadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const BADGE_CONFIG: Record<BadgeVariant, { backgroundColor: string; label: string }> = {
  new: {
    backgroundColor: LIBRARY_COLORS.primary,
    label: 'NOUVEAU',
  },
  generating: {
    backgroundColor: LIBRARY_COLORS.accent,
    label: 'EN COURS',
  },
  error: {
    backgroundColor: LIBRARY_COLORS.error,
    label: 'ERREUR',
  },
};

export const StoryBadge: React.FC<StoryBadgeProps> = ({ variant, label }) => {
  const config = BADGE_CONFIG[variant];

  return (
    <View style={[styles.container, { backgroundColor: config.backgroundColor }]}>
      <Text style={styles.text}>{label || config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: LIBRARY_DIMENSIONS.badgeBorderRadius,
  },
  text: {
    ...LIBRARY_TYPOGRAPHY.badge,
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default StoryBadge;
