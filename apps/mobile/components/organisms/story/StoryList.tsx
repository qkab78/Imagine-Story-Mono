import React from 'react';
import { StyleSheet, FlatList, View } from 'react-native';
import { Story } from '@/domain/stories/entities/Story';
import { StoryCard } from '@/components/molecules/story/StoryCard';
import { spacing } from '@/theme/spacing';

interface StoryListProps {
  stories: Story[];
  onStoryPress: (storyId: string) => void;
  onStoryLongPress?: (storyId: string) => void;
  ListEmptyComponent?: React.ReactElement;
}

export const StoryList: React.FC<StoryListProps> = ({
  stories,
  onStoryPress,
  onStoryLongPress,
  ListEmptyComponent,
}) => {
  return (
    <FlatList
      data={stories}
      keyExtractor={(item) => item.id.getValue()}
      renderItem={({ item }) => (
        <StoryCard
          story={item}
          onPress={onStoryPress}
          onLongPress={onStoryLongPress}
        />
      )}
      contentContainerStyle={styles.list}
      ListEmptyComponent={ListEmptyComponent}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: spacing.base,
  },
});

export default StoryList;
