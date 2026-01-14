import { useCallback } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { LibraryStoryCard, EmptyLibraryState } from '@/components/molecules/library';
import { LibraryStory } from '@/types/library';
import { LIBRARY_SPACING } from '@/constants/library';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const NUM_COLUMNS = 2;
const HORIZONTAL_PADDING = LIBRARY_SPACING.xxl;
const GAP = LIBRARY_SPACING.lg;
const CARD_WIDTH = (SCREEN_WIDTH - (HORIZONTAL_PADDING * 2) - GAP) / NUM_COLUMNS;

interface LibraryStoryGridProps {
  stories: LibraryStory[];
  highlightedStoryId?: string | null;
  newStoryIds?: string[];
  onStoryPress: (storyId: string) => void;
  onCreateStoryPress: () => void;
  isLoading?: boolean;
}

export const LibraryStoryGrid: React.FC<LibraryStoryGridProps> = ({
  stories,
  highlightedStoryId,
  newStoryIds = [],
  onStoryPress,
  onCreateStoryPress,
  isLoading = false,
}) => {
  const renderItem = useCallback(
    ({ item }: { item: LibraryStory }) => {
      const isHighlighted = item.id === highlightedStoryId;
      const isNew = newStoryIds.includes(item.id);

      return (
        <View style={styles.cardWrapper}>
          <LibraryStoryCard
            story={item}
            onPress={() => onStoryPress(item.id)}
            isHighlighted={isHighlighted}
            isNew={isNew}
          />
        </View>
      );
    },
    [highlightedStoryId, newStoryIds, onStoryPress]
  );

  const keyExtractor = useCallback((item: LibraryStory) => item.id, []);

  if (stories.length === 0 && !isLoading) {
    return <EmptyLibraryState onCreateStory={onCreateStoryPress} />;
  }

  return (
    <FlashList
      data={stories}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      numColumns={NUM_COLUMNS}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: LIBRARY_SPACING.xxl,
    paddingBottom: LIBRARY_SPACING.xxxl,
  },
  cardWrapper: {
    width: CARD_WIDTH,
    paddingRight: GAP / 2,
    paddingLeft: GAP / 2,
    marginBottom: LIBRARY_SPACING.lg,
  },
});

export default LibraryStoryGrid;
