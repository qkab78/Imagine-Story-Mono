import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Story } from '@/domain/stories/entities/Story';
import { StoryThumbnail } from '@/components/atoms/story/StoryThumbnail';
import { StoryTitle } from '@/components/atoms/story/StoryTitle';
import { StoryMeta } from './StoryMeta';
import { StoryFormatterService } from '@/domain/stories/services/StoryFormatterService';
import { colors } from '@/theme/colors';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface StoryCardProps {
  story: Story;
  onPress: (storyId: string) => void;
  onLongPress?: (storyId: string) => void;
}

export const StoryCard: React.FC<StoryCardProps> = ({ story, onPress, onLongPress }) => {
  const scaleAnimation = useSharedValue(1);
  const backgroundOpacity = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    scaleAnimation.value = withTiming(0.98, { duration: 100 });
    backgroundOpacity.value = withTiming(0.1, { duration: 100 });
  }, []);

  const handlePressOut = useCallback(() => {
    scaleAnimation.value = withTiming(1, { duration: 100 });
    backgroundOpacity.value = withTiming(0, { duration: 100 });
  }, []);

  const handlePress = useCallback(() => {
    runOnJS(onPress)(story.id.getValue());
  }, [onPress, story]);

  const handleLongPress = useCallback(() => {
    if (onLongPress) {
      runOnJS(onLongPress)(story.id.getValue());
    }
  }, [onLongPress, story]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
    backgroundColor: `rgba(255, 193, 7, ${backgroundOpacity.value})`,
  }));

  const coverImageUrl = story.coverImageUrl?.getValue() || '';
  const timeAgo = StoryFormatterService.formatTimeAgo(story.publicationDate.toDate());

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      onLongPress={handleLongPress}
      activeOpacity={1}
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
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 16,
    minHeight: 72,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
});

export default StoryCard;
