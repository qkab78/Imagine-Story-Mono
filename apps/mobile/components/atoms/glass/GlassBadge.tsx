import React from 'react';
import { StyleSheet } from 'react-native';
import { GlassView } from './GlassView';
import Text from '@/components/ui/Text';
import { spacing } from '@/theme/spacing';
import { typography } from '@/theme/typography';

export interface GlassBadgeProps {
  /** Texte du badge */
  label: string;

  /** Couleur de teinte pour l'effet glass */
  tintColor?: string;

  /** Style de glass: 'clear' (léger) ou 'regular' (prononcé) */
  glassStyle?: 'clear' | 'regular';

  /** Couleur du texte */
  textColor?: string;
}

/**
 * GlassBadge - Atom badge avec effet glass
 *
 * Petit badge avec effet glass pour indiquer des états, tags, catégories, etc.
 * Parfait pour remplacer les badges traditionnels avec un style moderne.
 */
export const GlassBadge: React.FC<GlassBadgeProps> = ({
  label,
  tintColor,
  glassStyle = 'clear',
  textColor = 'rgba(0, 0, 0, 0.7)',
}) => {
  return (
    <GlassView
      glassStyle={glassStyle}
      tintColor={tintColor}
      style={styles.badge}
      fallbackBackgroundColor="rgba(255, 255, 255, 0.85)"
    >
      <Text style={[styles.label, { color: textColor }]}>
        {label}
      </Text>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.xs,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: '600',
  },
});

export default GlassBadge;
