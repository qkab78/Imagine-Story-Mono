import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chapter } from '@/domain/stories/entities/Chapter';
import { StoryTitle } from '@/components/atoms/story/StoryTitle';
import Text from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface ChapterCardProps {
  chapter: Chapter;
  position: number;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, position }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.chapterNumber}>Chapitre {position}</Text>
        <StoryTitle title={chapter.title} variant="small" />
      </View>
      <Text style={styles.content}>{chapter.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: spacing.base,
    marginBottom: spacing.base,
  },
  header: {
    marginBottom: spacing.sm,
  },
  chapterNumber: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  content: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '400',
    color: colors.textPrimary,
    lineHeight: typography.fontSize.base * 1.5,
  },
});

export default ChapterCard;
