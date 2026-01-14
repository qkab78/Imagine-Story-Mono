import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { ChapterDivider, DropCapText } from '@/components/atoms/reader';
import { ChapterImage } from '@/components/molecules/reader';
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
}

export const ReaderContent: React.FC<ReaderContentProps> = ({
  chapter,
  chapterIndex,
}) => {
  // Split content into paragraphs
  const paragraphs = chapter.content
    .split('\n\n')
    .filter((p) => p.trim().length > 0);

  return (
    <ScrollView
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
    textIndent: '24px',
  },
});

export default ReaderContent;
