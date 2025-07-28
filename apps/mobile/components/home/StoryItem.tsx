import React, { useCallback } from 'react';
import { StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import type { StoryItemProps } from '@/types/home';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const StoryItem: React.FC<StoryItemProps> = ({ story, onPress, onLongPress }) => {
  const scaleAnimation = useSharedValue(1);
  const backgroundOpacity = useSharedValue(0);

  const formatTimeAgo = (date: string): string => {
    const dateObj = new Date(date);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return 'Hier';
    } else if (diffInHours < 48) {
      return '2j';
    } else if (diffInHours < 168) {
      return '1sem';
    } else {
      return 'Plus ancien';
    }
  };

  const handlePressIn = useCallback(() => {
    scaleAnimation.value = withTiming(0.98, { duration: 100 });
    backgroundOpacity.value = withTiming(0.1, { duration: 100 });
  }, []);

  const handlePressOut = useCallback(() => {
    scaleAnimation.value = withTiming(1, { duration: 100 });
    backgroundOpacity.value = withTiming(0, { duration: 100 });
  }, []);

  const handlePress = useCallback(() => {
    runOnJS(onPress)(story.slug);
  }, [onPress, story.slug]);

  const handleLongPress = useCallback(() => {
    if (onLongPress) {
      runOnJS(onLongPress)(String(story.id));
    }
  }, [onLongPress, story.id]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
    backgroundColor: `rgba(255, 193, 7, ${backgroundOpacity.value})`,
  }));

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
      // @todo: add duration and genre
      // accessibilityHint={`${story.duration} minutes de lecture, genre ${story.genre}`}
      accessibilityHint={`${story.chapters} chapitres`}
    >
      <Image source={{ uri: story.cover_image }} style={styles.thumbnail} />

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {story.title}
        </Text>
        <Text style={styles.meta}>
          {/* {story.duration} min de lecture • {story.genre} */}
          {story.chapters} chapitres
        </Text>
      </View>

      <Text style={styles.timestamp}>
        {formatTimeAgo(story.created_at.toString())}
      </Text>
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
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emoji: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    fontWeight: '400',
    color: '#616161',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  timestamp: {
    fontSize: 12,
    fontWeight: '400',
    color: '#9E9E9E',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
});

export default StoryItem;