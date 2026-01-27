import { ScrollView, StyleSheet } from 'react-native';
import { SectionTitle } from '@/components/atoms/explore';
import { ThemeCard } from '@/components/molecules/explore';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { EXPLORE_SPACING } from '@/constants/explore';
import type { PopularTheme } from '@/types/explore';

interface PopularThemesSectionProps {
  themes: PopularTheme[];
  onThemePress: (themeId: string) => void;
}

export const PopularThemesSection: React.FC<PopularThemesSectionProps> = ({
  themes,
  onThemePress,
}) => {
  const { t } = useAppTranslation('stories');

  if (themes.length === 0) return null;

  return (
    <>
      <SectionTitle title={t('explore.sections.popularThemes')} emoji="🎨" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {themes.map((theme) => (
          <ThemeCard
            key={theme.id}
            theme={theme}
            onPress={() => onThemePress(theme.id)}
          />
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginBottom: EXPLORE_SPACING.xxl,
  },
  scrollContent: {
    paddingHorizontal: EXPLORE_SPACING.xl,
    gap: EXPLORE_SPACING.md,
  },
});

export default PopularThemesSection;
