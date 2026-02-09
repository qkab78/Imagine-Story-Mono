import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { StoryCoverPlaceholder, StoryBadge } from '@/components/atoms/library';
import { GeneratingOverlay } from './GeneratingOverlay';
import { FailedOverlay } from './FailedOverlay';
import { LibraryStory } from '@/types/library';
import { LIBRARY_COLORS, LIBRARY_DIMENSIONS, LIBRARY_TYPOGRAPHY, LIBRARY_SPACING } from '@/constants/library';
import { formatRelativeDate } from '@/utils/date';

interface LibraryStoryCardProps {
  story: LibraryStory;
  onPress: () => void;
  onRetry?: (storyId: string) => void;
  isHighlighted?: boolean;
  isNew?: boolean;
  isRetrying?: boolean;
  retryLabel?: string;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const LibraryStoryCard: React.FC<LibraryStoryCardProps> = ({
  story,
  onPress,
  onRetry,
  isHighlighted = false,
  isNew = false,
  isRetrying = false,
  retryLabel = 'Retry',
}) => {
  const scale = useSharedValue(1);

  const isGenerating = story.generationStatus === 'generating';
  const isFailed = story.generationStatus === 'failed';
  const hasCoverImage = !!story.coverImageUrl;

  const handlePressIn = () => {
    scale.value = withSpring(0.97, { damping: 20, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleRetry = () => {
    onRetry?.(story.id);
  };

  const metaText = isGenerating || isFailed
    ? formatRelativeDate(story.publicationDate)
    : `${story.numberOfChapters} chap. · ${formatRelativeDate(story.publicationDate)}`;

  return (
    <AnimatedPressable
      style={[
        styles.container,
        animatedStyle,
        isGenerating && styles.generatingBorder,
        isFailed && styles.failedBorder,
        isHighlighted && styles.highlighted,
      ]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      disabled={isGenerating || isFailed}
    >
      {/* Cover */}
      <View style={styles.coverContainer}>
        {hasCoverImage ? (
          <Image source={{ uri: story.coverImageUrl! }} style={styles.coverImage} />
        ) : (
          <StoryCoverPlaceholder themeName={story.theme.name} />
        )}

        {/* Generating overlay */}
        {isGenerating && <GeneratingOverlay progress={story.generationProgress || 0} />}

        {/* Failed overlay */}
        {isFailed && (
          <FailedOverlay
            retryLabel={retryLabel}
            onRetry={handleRetry}
            isRetrying={isRetrying}
          />
        )}

        {/* New badge */}
        {isNew && !isGenerating && !isFailed && (
          <View style={styles.badgeContainer}>
            <StoryBadge variant="new" />
          </View>
        )}

        {/* Error badge */}
        {isFailed && (
          <View style={styles.badgeContainer}>
            <StoryBadge variant="error" />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {story.title}
        </Text>
        <Text style={styles.meta}>{metaText}</Text>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: LIBRARY_COLORS.surfaceElevated,
    borderRadius: LIBRARY_DIMENSIONS.cardBorderRadius,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  generatingBorder: {
    borderWidth: 2,
    borderColor: LIBRARY_COLORS.accent,
  },
  failedBorder: {
    borderWidth: 2,
    borderColor: LIBRARY_COLORS.error,
  },
  highlighted: {
    borderWidth: 2,
    borderColor: LIBRARY_COLORS.primary,
  },
  coverContainer: {
    position: 'relative',
    height: LIBRARY_DIMENSIONS.cardCoverHeight,
  },
  coverImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: LIBRARY_DIMENSIONS.cardBorderRadius,
    borderTopRightRadius: LIBRARY_DIMENSIONS.cardBorderRadius,
  },
  badgeContainer: {
    position: 'absolute',
    top: LIBRARY_SPACING.md,
    right: LIBRARY_SPACING.md,
  },
  info: {
    padding: LIBRARY_DIMENSIONS.cardInfoPadding,
  },
  title: {
    ...LIBRARY_TYPOGRAPHY.cardTitle,
    color: LIBRARY_COLORS.textPrimary,
    marginBottom: 4,
    lineHeight: 20,
  },
  meta: {
    ...LIBRARY_TYPOGRAPHY.cardMeta,
    color: LIBRARY_COLORS.textMuted,
  },
});

export default LibraryStoryCard;
