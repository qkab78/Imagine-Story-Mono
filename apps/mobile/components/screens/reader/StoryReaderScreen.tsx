import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ReaderHeader } from '@/components/molecules/reader';
import {
  ReaderContent,
  ReaderFooter,
  ChapterMenuSheet,
} from '@/components/organisms/reader';
import { useStoryReader } from '@/features/reader/hooks';
import { READER_COLORS, READER_SPACING } from '@/constants/reader';

export const StoryReaderScreen: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    storyTitle,
    conclusion,
    chapters,
    currentChapter,
    currentChapterIndex,
    totalChapters,
    progress,
    isLastChapter,
    isLoading,
    error,
    isMenuOpen,
    goToNextChapter,
    goToPreviousChapter,
    goToChapter,
    hasPreviousChapter,
    hasNextChapter,
    toggleMenu,
    closeMenu,
  } = useStoryReader(id || '');

  const handleBack = () => {
    router.back();
  };

  const handleClose = () => {
    router.back();
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={READER_COLORS.primary} />
        <Text style={styles.loadingText}>Chargement de l'histoire...</Text>
      </View>
    );
  }

  // Error state
  if (error || !currentChapter) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error || "Impossible de charger l'histoire"}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <ReaderHeader
        currentChapter={progress.currentChapter}
        totalChapters={totalChapters}
        onBack={handleBack}
        onClose={handleClose}
      />

      {/* Content */}
      <ReaderContent
        chapter={currentChapter}
        chapterIndex={currentChapterIndex}
        isLastChapter={isLastChapter}
        conclusion={conclusion}
      />

      {/* Footer */}
      <ReaderFooter
        currentChapter={progress.currentChapter}
        totalChapters={totalChapters}
        onPrevious={goToPreviousChapter}
        onNext={goToNextChapter}
        onMenu={toggleMenu}
        hasPrevious={hasPreviousChapter}
        hasNext={hasNextChapter}
      />

      {/* Chapter Menu Sheet */}
      <ChapterMenuSheet
        visible={isMenuOpen}
        onClose={closeMenu}
        chapters={chapters}
        currentChapterIndex={currentChapterIndex}
        onSelectChapter={goToChapter}
        storyTitle={storyTitle}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: READER_COLORS.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: READER_COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: READER_SPACING.xxl,
  },
  loadingText: {
    marginTop: READER_SPACING.lg,
    fontSize: 16,
    fontFamily: 'Nunito',
    color: READER_COLORS.textMuted,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Nunito',
    color: READER_COLORS.textMuted,
    textAlign: 'center',
  },
});

export default StoryReaderScreen;
