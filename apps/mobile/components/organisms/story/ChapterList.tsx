import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Chapter } from '@/domain/stories/entities/Chapter';
import { ChapterCard } from '@/components/molecules/story/ChapterCard';
import { spacing } from '@/theme/spacing';

interface ChapterListProps {
  chapters: readonly Chapter[];
}

export const ChapterList: React.FC<ChapterListProps> = ({ chapters }) => {
  return (
    <FlashList
      data={chapters}
      keyExtractor={(item) => String(item.id.getValue())}
      renderItem={({ item, index }) => (
        <ChapterCard chapter={item} position={index + 1} />
      )}
      contentContainerStyle={styles.list}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    padding: spacing.base,
  },
});

export default ChapterList;
