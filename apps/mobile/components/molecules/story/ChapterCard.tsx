import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Chapter } from '@/domain/stories/entities/Chapter';
import { StoryTitle } from '@/components/atoms/story/StoryTitle';
import { GlassCard } from '@/components/molecules/glass/GlassCard';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import Text from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface ChapterCardProps {
  chapter: Chapter;
  position: number;
}

export const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, position }) => {
  const { t } = useAppTranslation('stories');

  return (
    <GlassCard
      glassStyle="clear"
      tintColor="rgba(107, 70, 193, 0.03)"
      borderRadius={16}
      padding={spacing.base}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.chapterNumber}>{t('reader.chapterNumber', { position })}</Text>
        <StoryTitle title={chapter.title} variant="small" />
      </View>
      <Text style={styles.content}>{chapter.content}</Text>
    </GlassCard>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
    // backgroundColor, borderWidth, borderColor, borderRadius, padding handled by GlassCard
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
