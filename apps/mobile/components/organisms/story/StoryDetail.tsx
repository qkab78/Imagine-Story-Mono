import React from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Story } from '@/domain/stories/entities/Story';
import { StoryTitle } from '@/components/atoms/story/StoryTitle';
import { StoryThumbnail } from '@/components/atoms/story/StoryThumbnail';
import { ChapterList } from './ChapterList';
import Text from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface StoryDetailProps {
  story: Story;
}

export const StoryDetail: React.FC<StoryDetailProps> = ({ story }) => {
  const coverImageUrl = story.coverImageUrl?.getValue() || '';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <StoryThumbnail imageUrl={coverImageUrl} size={100} borderRadius={50} />
        <StoryTitle title={story.title} variant="large" numberOfLines={2} />
        <Text style={styles.synopsis}>{story.synopsis}</Text>
        <View style={styles.meta}>
          <Text style={styles.metaText}>
            Pour {story.childAge.getValue()} ans • {story.numberOfChapters} chapitres
          </Text>
        </View>
      </View>
      <ChapterList chapters={story.getAllChapters()} />
      {story.conclusion && (
        <View style={styles.conclusion}>
          <Text style={styles.conclusionTitle}>Conclusion</Text>
          <Text style={styles.conclusionText}>{story.conclusion}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: spacing.xl,
    backgroundColor: colors.cardBackground,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  synopsis: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.base,
    lineHeight: typography.fontSize.base * 1.5,
  },
  meta: {
    marginTop: spacing.base,
  },
  metaText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '500',
    color: colors.textTertiary,
  },
  conclusion: {
    padding: spacing.xl,
    backgroundColor: colors.cardBackground,
    marginTop: spacing.base,
  },
  conclusionTitle: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: spacing.base,
  },
  conclusionText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: typography.fontSize.base * 1.5,
  },
});

export default StoryDetail;
