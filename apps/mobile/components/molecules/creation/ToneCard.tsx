import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Tone } from '@/domain/stories/value-objects/settings/Tone';
import { GlassCard } from '@/components/molecules/glass/GlassCard';
import Text from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface ToneCardProps {
  tone: Tone;
  emoji?: string;
  isSelected: boolean;
  onPress: (tone: Tone) => void;
}

export const ToneCard: React.FC<ToneCardProps> = ({
  tone,
  emoji,
  isSelected,
  onPress
}) => {
  return (
    <GlassCard
      glassStyle="clear"
      tintColor={isSelected ? 'rgba(107, 70, 193, 0.1)' : undefined}
      onPress={() => onPress(tone)}
      borderRadius={16}
      padding={spacing.base}
      style={[
        styles.toneCard,
        isSelected && styles.toneSelected,
      ]}
    >
      <View
        style={styles.toneContent}
        accessibilityLabel={`Choisir le ton ${tone.name}`}
        accessibilityRole="button"
        accessibilityHint={tone.description}
      >
        {emoji && <Text style={styles.toneEmoji}>{emoji}</Text>}
        <View style={styles.toneText}>
          <Text style={styles.toneName}>{tone.name}</Text>
          <Text style={styles.toneDescription}>{tone.description}</Text>
        </View>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  toneCard: {
    marginBottom: spacing.base,
    // backgroundColor, borderWidth, borderColor, borderRadius, padding, shadows handled by GlassCard
  },
  toneSelected: {
    borderColor: colors.primaryPink,
    borderWidth: 3,
  },
  toneContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toneEmoji: {
    fontSize: 24,
    marginRight: spacing.base,
  },
  toneText: {
    flex: 1,
  },
  toneName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  toneDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: typography.fontSize.sm * 1.3,
  },
});

export default ToneCard;
