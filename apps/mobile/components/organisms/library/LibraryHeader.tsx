import { View, Text, StyleSheet } from 'react-native';
import { StoryCountText } from '@/components/atoms/library';
import { LibrarySearchButton } from '@/components/molecules/library';
import { LIBRARY_COLORS, LIBRARY_TYPOGRAPHY, LIBRARY_SPACING } from '@/constants/library';

interface LibraryHeaderProps {
  storyCount: number;
  onSearchPress: () => void;
}

export const LibraryHeader: React.FC<LibraryHeaderProps> = ({
  storyCount,
  onSearchPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>Ma Bibliothèque</Text>
        <LibrarySearchButton onPress={onSearchPress} />
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
