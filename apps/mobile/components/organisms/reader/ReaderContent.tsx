import { useRef, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ChapterDivider, DropCapText } from '@/components/atoms/reader';
import { ChapterImage } from '@/components/molecules/reader';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import {
  READER_COLORS,
  READER_SPACING,
  READER_TYPOGRAPHY,
  READER_DIMENSIONS,
} from '@/constants/reader';
import type { ReaderChapter } from '@/types/reader';

interface ReaderContentProps {
  chapter: ReaderChapter;
  chapterIndex: number;
  isLastChapter?: boolean;
  conclusion?: string;
}

export const ReaderContent: React.FC<ReaderContentProps> = ({
  chapter,
  chapterIndex,
  isLastChapter = false,
  conclusion,
}) => {
  const { t } = useAppTranslation('stories');
  const scrollViewRef = useRef<ScrollView>(null);

  // Scroll to top when chapter changes
  useEffect(() => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: false });
  }, [chapterIndex]);

  // Split content into paragraphs
  const paragraphs = chapter.content
    .split('\n\n')
    .filter((p) => p.trim().length > 0);

  const showConclusion = isLastChapter && conclusion;

  return (
    <ScrollView
      ref={scrollViewRef}
      style={styles.scrollView}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      {/* Chapter Image */}
      <ChapterImage imageUrl={chapter.imageUrl} chapterIndex={chapterIndex} />

      {/* Story Content */}
      <View style={styles.storyContent}>
        {/* Chapter Title */}
        <Text style={styles.chapterTitle}>{chapter.title}</Text>

        {/* Divider */}
        <View style={styles.dividerContainer}>
          <ChapterDivider />
        </View>

        {/* Story Text */}
        <View style={styles.textContainer}>
          {paragraphs.map((paragraph, index) => {
            if (index === 0) {
              // First paragraph with drop cap
              return <DropCapText key={index}>{paragraph}</DropCapText>;
            }
            return (
              <Text key={index} style={styles.paragraph}>
                {paragraph}
              </Text>
            );
          })}
        </View>

        {/* Conclusion (only on last chapter) */}
        {showConclusion && (
          <View style={styles.conclusionContainer}>
            <View style={styles.conclusionCard}>
              <Text style={styles.conclusionTitle}>{t('reader.endOfStory')}</Text>
              <View style={styles.conclusionDivider} />
              <Text style={styles.conclusionText}>{conclusion}</Text>
              <Text style={styles.conclusionEmoji}>✨ 🌟 ✨</Text>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: READER_DIMENSIONS.footerHeight + READER_SPACING.xxxl,
  },
  storyContent: {
    paddingHorizontal: 28,
    paddingTop: READER_SPACING.xxl,
  },
  chapterTitle: {
    fontSize: READER_TYPOGRAPHY.chapterTitle.fontSize,
    fontWeight: READER_TYPOGRAPHY.chapterTitle.fontWeight,
    fontFamily: 'Quicksand',
    color: READER_COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: READER_SPACING.xl,
  },
  dividerContainer: {
    marginBottom: READER_SPACING.xxxl,
  },
  textContainer: {
    gap: READER_SPACING.xxl,
  },
  paragraph: {
    fontSize: READER_TYPOGRAPHY.storyText.fontSize,
    lineHeight: READER_TYPOGRAPHY.storyText.lineHeight,
    fontFamily: 'Nunito',
    color: READER_COLORS.textPrimary,
    textAlign: 'justify',
  },
  conclusionContainer: {
    marginTop: READER_SPACING.xxxl,
  },
  conclusionCard: {
    backgroundColor: 'rgba(246, 193, 119, 0.15)',
    borderWidth: 2,
    borderColor: READER_COLORS.accent,
    borderRadius: 16,
    padding: READER_SPACING.xxl,
    alignItems: 'center',
  },
  conclusionTitle: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Quicksand',
    color: READER_COLORS.textPrimary,
    marginBottom: READER_SPACING.md,
  },
  conclusionDivider: {
    width: 40,
    height: 2,
    backgroundColor: READER_COLORS.accent,
    borderRadius: 1,
    marginBottom: READER_SPACING.lg,
  },
  conclusionText: {
    fontSize: READER_TYPOGRAPHY.storyText.fontSize,
    lineHeight: READER_TYPOGRAPHY.storyText.lineHeight,
    fontFamily: 'Nunito',
    color: READER_COLORS.textPrimary,
    textAlign: 'center',
  },
  conclusionEmoji: {
    fontSize: 24,
    marginTop: READER_SPACING.lg,
  },
});

export default ReaderContent;
