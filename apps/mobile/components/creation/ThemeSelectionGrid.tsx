import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import { Theme } from '@/types/creation';
import Text from '@/components/ui/Text';
import KidButton from '@/components/Onboarding/KidButton';
import { Dimensions } from 'react-native';
import Box from '../ui/Box';

const { width } = Dimensions.get('window')
const CARD_WIDTH = width * 0.40;
const CARD_HEIGHT = 120;

interface ThemeSelectionGridProps {
  themes: Theme[];
  selectedTheme: Theme | null;
  onThemeSelect: (theme: Theme) => void;
  onCreateStory: () => void;
}

const ThemeSelectionGrid: React.FC<ThemeSelectionGridProps> = ({
  themes,
  selectedTheme,
  onThemeSelect,
  onCreateStory,
}) => {
  const handleThemePress = (theme: Theme) => {
    onThemeSelect(theme);
  };

  return (
    <Box style={styles.container}>
      <View style={styles.themeGrid}>
        {themes.map((theme) => {
          const isSelected = selectedTheme?.id === theme.id;
          
          return (
            <TouchableOpacity
              key={theme.id}
              style={[
                styles.themeCard,
                isSelected && styles.themeSelected,
              ]}
              onPress={() => handleThemePress(theme)}
              activeOpacity={0.8}
              accessibilityLabel={`Choisir le thème ${theme.name}`}
              accessibilityRole="button"
              accessibilityHint={theme.description}
            >
              <Text style={styles.themeEmoji}>{theme.emoji}</Text>
              <Text style={styles.themeName}>{theme.name}</Text>
              <Text style={styles.themeDescription}>{theme.description}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <KidButton
          title="Créer mon histoire !"
          emoji="🌟"
          onPress={onCreateStory}
        />
      </View>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
  },

  themeCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.cardBackground,
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: spacing.base,
    alignItems: 'center',
    marginBottom: spacing.base,
    minHeight: CARD_HEIGHT,
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

  buttonContainer: {
    marginBottom: spacing.lg,
  },
});

export default ThemeSelectionGrid;