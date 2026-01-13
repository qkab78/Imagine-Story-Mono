import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Theme } from '@/domain/stories/value-objects/settings/Theme';
import { GlassCard } from '@/components/molecules/glass/GlassCard';
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
    <GlassCard
      glassStyle="clear"
      tintColor={isSelected ? 'rgba(107, 70, 193, 0.1)' : 'rgba(255, 255, 255, 0.05)'}
      onPress={() => onPress(theme)}
      borderRadius={16}
      padding={spacing.base}
      style={[
        styles.themeCard,
        { width: cardWidth, minHeight: cardHeight },
        isSelected && styles.themeSelected,
      ]}
    >
      <View
        style={styles.content}
        accessibilityLabel={`Choisir le thème ${theme.name}`}
        accessibilityRole="button"
        accessibilityHint={theme.description}
      >
        {emoji && <Text style={styles.themeEmoji}>{emoji}</Text>}
        <Text style={styles.themeName}>{theme.name}</Text>
        <Text style={styles.themeDescription}>{theme.description}</Text>
      </View>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  themeCard: {
    marginBottom: spacing.base,
    // backgroundColor, borderWidth, borderColor, borderRadius, padding, shadows handled by GlassCard
  },
  themeSelected: {
    borderColor: colors.safetyGreen,
    borderWidth: 3,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
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
