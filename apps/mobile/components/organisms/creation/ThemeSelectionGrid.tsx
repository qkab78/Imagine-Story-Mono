import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Theme } from '@/domain/stories/value-objects/settings/Theme';
import { ThemeCard } from '@/components/molecules/creation/ThemeCard';
import KidButton from '@/components/Onboarding/KidButton';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import Box from '@/components/ui/Box';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.40;

interface ThemeSelectionGridProps {
  themes: Theme[];
  themeEmojis?: Record<string, string>;
  themeColors?: Record<string, string>;
  selectedTheme: Theme | null;
  onThemeSelect: (theme: Theme) => void;
  onCreateStory: () => void;
}

export const ThemeSelectionGrid: React.FC<ThemeSelectionGridProps> = ({
  themes,
  themeEmojis,
  themeColors,
  selectedTheme,
  onThemeSelect,
  onCreateStory,
}) => {
  const { t } = useAppTranslation('stories');

  return (
    <Box style={styles.container}>
      <View style={styles.themeGrid}>
        {themes.map((theme) => {
          const isSelected = selectedTheme?.getIdValue() === theme.getIdValue();

          return (
            <ThemeCard
              key={theme.getIdValue()}
              theme={theme}
              emoji={themeEmojis?.[theme.getIdValue()]}
              color={themeColors?.[theme.getIdValue()]}
              isSelected={isSelected}
              onPress={onThemeSelect}
              cardWidth={CARD_WIDTH}
            />
          );
        })}
      </View>

      <View style={styles.buttonContainer}>
        <KidButton
          title={t('creation.themeSelection.createButton')}
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
  buttonContainer: {
    marginBottom: spacing.lg,
  },
});

export default ThemeSelectionGrid;
