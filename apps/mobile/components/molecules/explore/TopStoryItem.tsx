import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DualIcon } from '@/components/ui/DualIcon';
import { StarRating } from '@/components/atoms/explore';
import {
  EXPLORE_COLORS,
  EXPLORE_SPACING,
  EXPLORE_DIMENSIONS,
  EXPLORE_ICONS,
} from '@/constants/explore';
import type { TopStory } from '@/types/explore';

interface TopStoryItemProps {
  story: TopStory;
  onPress: () => void;
}

export const TopStoryItem: React.FC<TopStoryItemProps> = ({ story, onPress }) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* Rank */}
      <View style={[styles.rankContainer, { backgroundColor: story.accentColor }]}>
        <Text style={styles.rank}>{story.rank}</Text>
      </View>

      {/* Cover */}
      <LinearGradient
        colors={story.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cover}
      >
        <Text style={styles.emoji}>{story.emoji}</Text>
      </LinearGradient>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {story.title}
        </Text>
        <Text style={styles.hero} numberOfLines={1}>
          {story.hero}
        </Text>
        <View style={styles.metadata}>
          <StarRating rating={story.rating} size={10} />
          <Text style={styles.metaText}>• {story.chapters} ch.</Text>
        </View>
      </View>

      {/* Read button */}
      <Pressable style={styles.readButton} onPress={onPress}>
        <DualIcon
          icon={EXPLORE_ICONS.book}
          size={16}
          color={EXPLORE_COLORS.primary}
        />
      </Pressable>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: EXPLORE_SPACING.md,
    paddingHorizontal: EXPLORE_SPACING.lg,
    gap: EXPLORE_SPACING.md,
  },
  rankContainer: {
    width: EXPLORE_DIMENSIONS.topStoryRankSize,
    height: EXPLORE_DIMENSIONS.topStoryRankSize,
    borderRadius: EXPLORE_DIMENSIONS.topStoryRankSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rank: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textLight,
  },
  cover: {
    width: EXPLORE_DIMENSIONS.topStoryCoverSize,
    height: EXPLORE_DIMENSIONS.topStoryCoverSize,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Quicksand',
    color: EXPLORE_COLORS.textPrimary,
  },
  hero: {
    fontSize: 12,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textMuted,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EXPLORE_SPACING.xs,
  },
  metaText: {
    fontSize: 11,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textMuted,
  },
  readButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(47, 107, 79, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default TopStoryItem;
