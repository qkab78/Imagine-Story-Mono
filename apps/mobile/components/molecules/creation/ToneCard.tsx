import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Tone } from '@/domain/stories/value-objects/settings/Tone';
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
    <TouchableOpacity
      style={[
        styles.toneCard,
        isSelected && styles.toneSelected,
      ]}
      onPress={() => onPress(tone)}
      activeOpacity={0.8}
      accessibilityLabel={`Choisir le ton ${tone.name}`}
      accessibilityRole="button"
      accessibilityHint={tone.description}
    >
      <View style={styles.toneContent}>
        {emoji && <Text style={styles.toneEmoji}>{emoji}</Text>}
        <View style={styles.toneText}>
          <Text style={styles.toneName}>{tone.name}</Text>
          <Text style={styles.toneDescription}>{tone.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toneCard: {
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: spacing.base,
    marginBottom: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  toneSelected: {
    borderColor: colors.primaryPink,
    borderWidth: 3,
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
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
