import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Theme } from '@/domain/stories/value-objects/settings/Theme';
import Text from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface ThemeCardProps {
  theme: Theme;
  emoji?: string;
  color?: string;
  isSelected: boolean;
  onPress: (theme: Theme) => void;
  cardWidth?: number;
  cardHeight?: number;
}

export const ThemeCard: React.FC<ThemeCardProps> = ({ 
  theme, 
  emoji,
  color,
  isSelected, 
  onPress,
  cardWidth,
  cardHeight = 120
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.themeCard,
        { width: cardWidth, minHeight: cardHeight },
        isSelected && styles.themeSelected,
      ]}
      onPress={() => onPress(theme)}
      activeOpacity={0.8}
      accessibilityLabel={`Choisir le thème ${theme.name}`}
      accessibilityRole="button"
      accessibilityHint={theme.description}
    >
      {emoji && <Text style={styles.themeEmoji}>{emoji}</Text>}
      <Text style={styles.themeName}>{theme.name}</Text>
      <Text style={styles.themeDescription}>{theme.description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  themeCard: {
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: spacing.base,
    alignItems: 'center',
    marginBottom: spacing.base,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  themeSelected: {
    borderColor: colors.safetyGreen,
    borderWidth: 3,
    shadowColor: colors.safetyGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  themeEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  themeName: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  themeDescription: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.regular,
    fontWeight: '400',
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: typography.fontSize.sm * 1.3,
  },
});

export default ThemeCard;
