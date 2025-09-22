import React, { useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, Pressable, Share, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { getStoryBySlug } from '@/api/stories';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import type { StoryChapter, ChapterImage } from '@imagine-story/api/app/stories/entities';

// Interfaces pour les props des composants
interface IntegratedHeaderProps {
  onBack: () => void;
  onSharePress: () => void;
}

interface MiniCoverProps {
  emoji?: string;
  size?: number;
}

interface ReadingTitleProps {
  title: string;
}

interface ChaptersContainerProps {
  chapters: StoryChapter[];
  chapterImages?: ChapterImage[];
}

interface ChapterCardProps {
  chapter: StoryChapter;
  index: number;
  onPress?: () => void;
  chapterImage?: ChapterImage;
}

interface ChapterHeaderProps {
  title: string;
  duration: number;
  emoji: string;
}

interface ChapterDurationProps {
  duration: number;
}

interface ConclusionCardProps {
  conclusion: {
    title?: string;
    content: string;
    emoji?: string;
  };
}

// Sous-composant Header intégré pour la lecture
const IntegratedHeader: React.FC<IntegratedHeaderProps> = ({
  onBack,
  onSharePress
}) => {
  const shareScale = useSharedValue(1);

  const handleSharePress = useCallback(() => {
    shareScale.value = withSequence(
      withTiming(1.1, { duration: 150 }),
      withTiming(1, { duration: 150 })
    );
    runOnJS(onSharePress)();
  }, [onSharePress]);

  const shareAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: shareScale.value }],
  }));

  return (
    <View style={styles.integratedHeader}>
      <Pressable style={styles.headerButton} onPress={onBack}>
        <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
      </Pressable>

      <Animated.View style={shareAnimatedStyle}>
        <Pressable style={styles.headerButton} onPress={handleSharePress} disabled={true}>
          <Ionicons name="share-outline" size={24} color={colors.textPrimary} />
        </Pressable>
      </Animated.View>
    </View>
  );
};

// Sous-composant Mini Cover
const MiniCover: React.FC<MiniCoverProps> = ({ emoji = '📚', size = 80 }) => (
  <LinearGradient
    colors={[colors.miniCoverGradientStart, colors.miniCoverGradientEnd]}
    style={[styles.miniCover, { width: size, height: size }]}
  >
    <Text style={[styles.miniCoverEmoji, { fontSize: size * 0.4 }]}>{emoji}</Text>
  </LinearGradient>
);

// Sous-composant Titre de lecture
const ReadingTitle: React.FC<ReadingTitleProps> = ({ title }) => (
  <Text style={styles.readingTitle}>{title}</Text>
);


// Sous-composant Header de chapitre
const ChapterHeader: React.FC<ChapterHeaderProps> = ({ title, duration, emoji }) => (
  <View style={styles.chapterHeader}>
    <Text style={styles.chapterTitle}>{emoji} {title}</Text>
  </View>
);

// Sous-composant Card de chapitre
const ChapterCard: React.FC<ChapterCardProps> = ({ chapter, index, onPress, chapterImage }) => {
  const cardScale = useSharedValue(1);

  const handleChapterPress = useCallback(() => {
    cardScale.value = withSequence(
      withTiming(0.98, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    if (onPress) {
      runOnJS(onPress)();
    }
  }, [onPress]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));


  return (
    <Animated.View style={cardAnimatedStyle}>
      <Pressable style={styles.chapterCard} onPress={handleChapterPress}>
        <ChapterHeader
          title={`Chapitre ${index + 1} : ${chapter.title}`}
          duration={3}
          emoji="📖"
        />

        <View style={styles.chapterContent}>
          {chapterImage && (
            <View style={styles.chapterImageContainer}>
              <Image
                source={{ uri: chapterImage.imagePath }}
                style={styles.chapterImage}
                resizeMode="cover"
              />
            </View>
          )}

          <View style={styles.chapterTextContainer}>
            <Text style={styles.chapterText}>{chapter.content}</Text>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Sous-composant Container des chapitres
const ChaptersContainer: React.FC<ChaptersContainerProps> = ({ chapters, chapterImages }) => (
  <View style={styles.chaptersContainer}>
    {chapters.map((chapter, index) => {
      const chapterImage = chapterImages?.find(img => img.chapterIndex === index);
      return (
        <ChapterCard
          key={`${chapter.title}-${index}`}
          chapter={chapter}
          index={index}
          chapterImage={chapterImage}
          onPress={() => {
            // Optionnel: Scroll vers un chapitre spécifique ou marquer comme lu
          }}
        />
      );
    })}
  </View>
);

// Sous-composant Card de conclusion
const ConclusionCard: React.FC<ConclusionCardProps> = ({ conclusion }) => (
  <View style={styles.conclusionCard}>
    <Text style={styles.conclusionTitle}>
      🌟 {conclusion.title || 'Fin de l\'Histoire'}
    </Text>
    <Text style={styles.conclusionText}>
      {conclusion.content}
    </Text>
  </View>
);

// Composant principal StoryReaderScreen
const StoryReaderScreen: React.FC = () => {
  const router = useRouter();
  const { slug } = useLocalSearchParams();

  const { data: story, isLoading, error } = useQuery({
    queryKey: ['story', slug],
    queryFn: () => getStoryBySlug(slug as string),
  });

  const handleBack = () => {
    router.back();
  };

  const handleShare = async () => {
    if (!story) return;

    try {
      await Share.share({
        message: `Découvrez "${story.title}" sur Mon Petit Conteur !`,
        title: story.title,
      });
    } catch (error) {
      console.error('Error sharing story:', error);
    }
  };

  if (isLoading) {
    return (
      <LinearGradient
        colors={[colors.backgroundReading, colors.backgroundReadingEnd]}
        style={styles.container}
      >
        <SafeAreaView style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement de l'histoire...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (error || !story) {
    return (
      <LinearGradient
        colors={[colors.backgroundReading, colors.backgroundReadingEnd]}
        style={styles.container}
      >
        <SafeAreaView style={styles.errorContainer}>
          <Text style={styles.errorText}>Erreur lors du chargement de l'histoire</Text>
          <Pressable style={styles.retryButton} onPress={() => router.back()}>
            <Text style={styles.retryButtonText}>Retour</Text>
          </Pressable>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[colors.backgroundReading, colors.backgroundReadingEnd]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: story.coverImage }} style={styles.coverImage} />
        <View style={styles.integratedHeaderContainer}>
          <IntegratedHeader
            onBack={handleBack}
            onSharePress={handleShare}
          />

          <View style={styles.readingTitleContainer}>
            <ReadingTitle title={story.title} />
          </View>
        </View>

        <View>
          <View style={styles.readingContent}>
            <ChaptersContainer
              chapters={story.chapters || []}
              chapterImages={story.chapterImages || []}
            />

            {story.conclusion && (
              <ConclusionCard
                conclusion={{
                  title: 'Fin de l\'Histoire',
                  content: story.conclusion,
                  emoji: '🌟'
                }}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContainer: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.primary,
  },

  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },

  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontFamily: typography.fontFamily.primary,
  },

  retryButton: {
    backgroundColor: colors.primaryPink,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },

  retryButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: typography.fontFamily.primary,
  },

  integratedHeader: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  integratedHeaderContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    zIndex: 1000,
  },

  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.cardBackground,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: -0.2,
    fontFamily: typography.fontFamily.primary,
  },

  readingTitleContainer: {
    position: 'absolute',
    top: 150,
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  readingContent: {
    gap: spacing.lg,
    padding: spacing.lg,
  },

  miniCover: {
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    shadowColor: colors.miniCoverGradientStart,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },

  miniCoverEmoji: {
    fontSize: 32,
  },

  readingTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.2,
    fontFamily: typography.fontFamily.primary,
    width: '100%',
  },

  chaptersContainer: {
    gap: 16,
    marginBottom: spacing.xl,
  },

  chapterCard: {
    backgroundColor: colors.cardBackground,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  chapterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  chapterTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: -0.1,
    flex: 1,
    fontFamily: typography.fontFamily.primary,
  },

  chapterDuration: {
    backgroundColor: colors.chapterDurationBackground,
    color: colors.chapterDurationText,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '600',
    fontFamily: typography.fontFamily.primary,
  },

  chapterContent: {
    flexDirection: 'column',
    gap: spacing.md,
  },

  chapterImageContainer: {
    width: '100%',
    height: 380,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: spacing.sm,
    backgroundColor: colors.cardBorder,
  },

  chapterImage: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.cardBorder,
  },

  chapterTextContainer: {
    flex: 1,
  },

  chapterText: {
    fontSize: 14,
    color: colors.textTertiary,
    lineHeight: 19.6, // 1.4 * 14
    fontFamily: typography.fontFamily.primary,
    textAlign: 'justify',
  },

  conclusionCard: {
    backgroundColor: colors.conclusionBackground,
    borderWidth: 2,
    borderColor: colors.conclusionBorder,
    borderRadius: 16,
    padding: spacing.lg,
    alignItems: 'center',
  },

  conclusionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
    fontFamily: typography.fontFamily.primary,
  },

  conclusionText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22.5, // 1.5 * 15
    textAlign: 'justify',
    fontFamily: typography.fontFamily.primary,
  },

  coverImage: {
    width: '100%',
    height: 300,
    borderRadius: 16,
  },
});

export default StoryReaderScreen;