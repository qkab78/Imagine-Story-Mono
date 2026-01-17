import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StoryBadge, StarRating } from '@/components/atoms/explore';
import {
  EXPLORE_COLORS,
  EXPLORE_SPACING,
  EXPLORE_DIMENSIONS,
} from '@/constants/explore';
import type { ExploreStory } from '@/types/explore';

interface NewReleaseCardProps {
  story: ExploreStory;
  onPress: () => void;
}

export const NewReleaseCard: React.FC<NewReleaseCardProps> = ({
  story,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {/* Top section with gradient and emoji */}
      <LinearGradient
        colors={story.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.imageSection}
      >
        <Text style={styles.emoji}>{story.emoji}</Text>
        {story.isNew && (
          <View style={styles.badgeContainer}>
            <StoryBadge type="new" />
          </View>
        )}
      </LinearGradient>

      {/* Bottom section with info */}
      <View style={styles.infoSection}>
        <Text style={styles.title} numberOfLines={2}>
          {story.title}
        </Text>
        <Text style={styles.hero} numberOfLines={1}>
          {story.hero}
        </Text>
        <View style={styles.footer}>
          <StarRating rating={story.rating} size={10} />
          <Text style={styles.chapters}>{story.chapters} ch.</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: EXPLORE_DIMENSIONS.newReleaseCardWidth,
    height: EXPLORE_DIMENSIONS.newReleaseCardHeight,
    backgroundColor: EXPLORE_COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: EXPLORE_COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  imageSection: {
    height: 90,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  emoji: {
    fontSize: 40,
  },
  badgeContainer: {
    position: 'absolute',
    top: EXPLORE_SPACING.sm,
    left: EXPLORE_SPACING.sm,
  },
  infoSection: {
    flex: 1,
    padding: EXPLORE_SPACING.md,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Quicksand',
    color: EXPLORE_COLORS.textPrimary,
    lineHeight: 16,
  },
  hero: {
    fontSize: 11,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chapters: {
    fontSize: 10,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textMuted,
  },
});

export default NewReleaseCard;
