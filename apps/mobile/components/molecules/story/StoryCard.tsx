import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { StoryListItem } from '@/domain/stories/value-objects/StoryListItem';
import { StoryThumbnail } from '@/components/atoms/story/StoryThumbnail';
import { StoryTitle } from '@/components/atoms/story/StoryTitle';
import { StoryMeta } from './StoryMeta';
import { StoryFormatterService } from '@/domain/stories/services/StoryFormatterService';
import { GlassCard } from '@/components/molecules/glass/GlassCard';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import useOfflineStore from '@/store/offline/offlineStore';
import { useAppTranslation } from '@/hooks/useAppTranslation';

interface StoryCardProps {
  story: StoryListItem;
  onPress: (storyId: string) => void;
  onLongPress?: (storyId: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onPress, onLongPress }) => {
  const { t } = useAppTranslation('stories');
  const scaleAnimation = useSharedValue(1);
  const { trigger: triggerHaptic } = useHapticFeedback();
  const isDownloaded = useOfflineStore((state) => state.isStoryDownloaded(story.id.getValue()));

  const handlePressIn = useCallback(() => {
    scaleAnimation.value = withTiming(0.98, { duration: 100 });
    triggerHaptic('light');
  }, [triggerHaptic]);

  const handlePressOut = useCallback(() => {
    scaleAnimation.value = withTiming(1, { duration: 100 });
  }, []);

  const handlePress = useCallback(() => {
    onPress(story.id.getValue());
  }, [onPress, story]);

  const handleLongPress = useCallback(() => {
    if (onLongPress) {
      onLongPress(story.id.getValue());
    }
  }, [onLongPress, story]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
  }));

  const coverImageUrl = story.coverImageUrl?.getValue() || '';
  const timeAgo = StoryFormatterService.formatTimeAgo(story.publicationDate.toDate());

  return (
    <Animated.View style={animatedStyle}>
      <GlassCard
        glassStyle="clear"
        tintColor="rgba(107, 70, 193, 0.03)"
        onPress={handlePress}
        onLongPress={handleLongPress}
        borderRadius={16}
        padding={12}
      >
        <View
          style={styles.container}
          onTouchStart={handlePressIn}
          onTouchEnd={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={t('card.storyLabel', { title: story.title })}
          accessibilityHint={t('card.chaptersHint', { count: story.numberOfChapters })}
        >
          <View style={styles.thumbnailContainer}>
            <StoryThumbnail imageUrl={coverImageUrl} />
            {isDownloaded && (
              <View style={styles.downloadedBadge}>
                <Ionicons name="cloud-done" size={12} color="#fff" />
              </View>
            )}
          </View>
          <View style={styles.content}>
            <StoryTitle title={story.title} />
            <StoryMeta
              numberOfChapters={story.numberOfChapters}
              timeAgo={timeAgo}
            />
          </View>
        </View>
      </GlassCard>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 72,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  downloadedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
});

export default StoryCard;
