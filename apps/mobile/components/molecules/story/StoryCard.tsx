import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { StoryListItem } from '@/domain/stories/value-objects/StoryListItem';
import { StoryThumbnail } from '@/components/atoms/story/StoryThumbnail';
import { StoryTitle } from '@/components/atoms/story/StoryTitle';
import { StoryMeta } from './StoryMeta';
import { StoryFormatterService } from '@/domain/stories/services/StoryFormatterService';
import { GlassCard } from '@/components/molecules/glass/GlassCard';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface StoryCardProps {
  story: StoryListItem;
  onPress: (storyId: string) => void;
  onLongPress?: (storyId: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onPress, onLongPress }) => {
  const scaleAnimation = useSharedValue(1);
  const { trigger: triggerHaptic } = useHapticFeedback();

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
          accessibilityLabel={`Histoire: ${story.title}`}
          accessibilityHint={`${story.numberOfChapters} chapitres`}
        >
          <StoryThumbnail imageUrl={coverImageUrl} />
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
    // padding and borderRadius handled by GlassCard
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
});

export default StoryCard;
