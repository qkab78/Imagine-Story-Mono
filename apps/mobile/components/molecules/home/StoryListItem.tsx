import { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { StoryDate } from '@/components/atoms/home';
import { useAppTranslation } from '@/hooks/useAppTranslation';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface StoryListItemProps {
  story: {
    id: string;
    title: string;
    chaptersCount: number;
    createdAt?: Date | string;
  };
  onPress: (storyId: string) => void;
}

export const StoryListItem: React.FC<StoryListItemProps> = ({ story, onPress }) => {
  const { t } = useAppTranslation('stories');
  const translateX = useSharedValue(0);
  const shadowOpacity = useSharedValue(0.06);

  const handlePressIn = useCallback(() => {
    translateX.value = withTiming(4, { duration: 150 });
    shadowOpacity.value = withTiming(0.1, { duration: 150 });
  }, []);

  const handlePressOut = useCallback(() => {
    translateX.value = withTiming(0, { duration: 150 });
    shadowOpacity.value = withTiming(0.06, { duration: 150 });
  }, []);

  const handlePress = useCallback(() => {
    onPress(story.id);
  }, [story.id, onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    shadowOpacity: shadowOpacity.value,
  }));

  const chapterText = story.chaptersCount === 1
    ? t('card.chapter', { count: story.chaptersCount })
    : t('card.chapters', { count: story.chaptersCount });

  return (
    <AnimatedTouchableOpacity
      style={[styles.container, animatedStyle]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel={`${story.title}. ${chapterText}`}
      accessibilityHint={t('card.pressToRead')}
    >
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {story.title}
        </Text>
        <Text style={styles.meta}>{chapterText}</Text>
      </View>
      <View style={styles.dateContainer}>
        <StoryDate date={story.createdAt} />
      </View>
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontFamily: 'Quicksand',
    fontSize: 17,
    fontWeight: '700',
    color: '#1F3D2B',
    marginBottom: 6,
    lineHeight: 22,
  },
  meta: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8BA598',
    fontFamily: 'Nunito',
  },
  dateContainer: {
    flexShrink: 0,
    alignItems: 'flex-end',
  },
});

export default StoryListItem;
