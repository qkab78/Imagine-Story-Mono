import { View, Text, StyleSheet } from 'react-native';
import { StoryCountText } from '@/components/atoms/library';
import { FilterButton } from '@/components/atoms/filters';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { LIBRARY_COLORS, LIBRARY_TYPOGRAPHY, LIBRARY_SPACING } from '@/constants/library';

interface LibraryHeaderProps {
  storyCount: number;
  onFilterPress: () => void;
  activeFiltersCount?: number;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  storyCount,
  onFilterPress,
  activeFiltersCount = 0,
}) => {
  const { t } = useAppTranslation('stories');

  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{t('library.title')}</Text>
        <FilterButton onPress={onFilterPress} activeFiltersCount={activeFiltersCount} />
      </View>
      <StoryCountText count={storyCount} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: LIBRARY_SPACING.xxl,
    paddingTop: LIBRARY_SPACING.lg,
    paddingBottom: LIBRARY_SPACING.md,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: LIBRARY_SPACING.xs,
  },
  title: {
    ...LIBRARY_TYPOGRAPHY.title,
    color: LIBRARY_COLORS.textPrimary,
  },
});

export default LibraryHeader;
