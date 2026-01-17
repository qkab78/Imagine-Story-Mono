import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DualIcon } from '@/components/ui/DualIcon';
import { StoryBadge, StarRating } from '@/components/atoms/explore';
import {
  EXPLORE_COLORS,
  EXPLORE_SPACING,
  EXPLORE_DIMENSIONS,
  EXPLORE_ICONS,
} from '@/constants/explore';
import type { FeaturedStory } from '@/types/explore';

interface FeaturedStoryCardProps {
  story: FeaturedStory;
  onPress: () => void;
}

export const FeaturedStoryCard: React.FC<FeaturedStoryCardProps> = ({
  story,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <LinearGradient
        colors={story.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Decorative emoji */}
        <Text style={styles.decorativeEmoji}>{story.emoji}</Text>

        {/* Badge */}
        <View style={styles.badgeContainer}>
          <StoryBadge type="featured" />
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {story.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {story.description}
          </Text>

          {/* Metadata */}
          <View style={styles.metadata}>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{story.ageRange}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <DualIcon
                icon={EXPLORE_ICONS.bookOpen}
                size={14}
                color={EXPLORE_COLORS.textLight}
              />
              <Text style={styles.metaText}>{story.chapters} chapitres</Text>
            </View>
            <View style={styles.metaDivider} />
            <StarRating rating={story.rating} size={14} />
          </View>

          {/* CTA Button */}
          <View style={styles.ctaButton}>
            <DualIcon
              icon={EXPLORE_ICONS.play}
              size={16}
              color={EXPLORE_COLORS.primary}
            />
            <Text style={styles.ctaText}>Commencer à lire</Text>
          </View>
        </View>
      </LinearGradient>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: EXPLORE_SPACING.xl,
    marginBottom: EXPLORE_SPACING.xxl,
  },
  card: {
    borderRadius: EXPLORE_DIMENSIONS.featuredCardBorderRadius,
    minHeight: EXPLORE_DIMENSIONS.featuredCardHeight,
    padding: EXPLORE_SPACING.xl,
    overflow: 'hidden',
    position: 'relative',
  },
  decorativeEmoji: {
    position: 'absolute',
    top: -20,
    right: -20,
    fontSize: 120,
    opacity: 0.2,
  },
  badgeContainer: {
    marginBottom: EXPLORE_SPACING.lg,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Quicksand',
    color: EXPLORE_COLORS.textLight,
    marginBottom: EXPLORE_SPACING.sm,
  },
  description: {
    fontSize: 15,
    fontFamily: 'Nunito',
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: EXPLORE_SPACING.lg,
    lineHeight: 22,
  },
  metadata: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: EXPLORE_SPACING.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EXPLORE_SPACING.xs,
  },
  metaText: {
    fontSize: 13,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textLight,
  },
  metaDivider: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: EXPLORE_SPACING.sm,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: EXPLORE_COLORS.surface,
    paddingVertical: EXPLORE_SPACING.md,
    paddingHorizontal: EXPLORE_SPACING.xl,
    borderRadius: 12,
    gap: EXPLORE_SPACING.sm,
    alignSelf: 'flex-start',
  },
  ctaText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.primary,
  },
});

export default FeaturedStoryCard;
