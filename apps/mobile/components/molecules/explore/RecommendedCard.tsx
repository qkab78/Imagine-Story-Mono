import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StarRating } from '@/components/atoms/explore';
import {
  EXPLORE_COLORS,
  EXPLORE_SPACING,
  EXPLORE_DIMENSIONS,
} from '@/constants/explore';
import type { ExploreStory } from '@/types/explore';

interface RecommendedCardProps {
  story: ExploreStory;
  onPress: () => void;
}

export const RecommendedCard: React.FC<RecommendedCardProps> = ({
  story,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {/* Top colored section */}
      <LinearGradient
        colors={story.gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.topSection}
      >
        <Text style={styles.emoji}>{story.emoji}</Text>
      </LinearGradient>

      {/* Content section */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {story.title}
        </Text>
        <Text style={styles.hero} numberOfLines={1}>
          {story.hero}
        </Text>

        <View style={styles.footer}>
          <StarRating rating={story.rating} size={11} />
          <Text style={styles.ageRange}>{story.ageRange}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: EXPLORE_DIMENSIONS.recommendedCardWidth,
    height: EXPLORE_DIMENSIONS.recommendedCardHeight,
    backgroundColor: EXPLORE_COLORS.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: EXPLORE_COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  topSection: {
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 40,
  },
  content: {
    flex: 1,
    padding: EXPLORE_SPACING.md,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Quicksand',
    color: EXPLORE_COLORS.textPrimary,
    lineHeight: 18,
  },
  hero: {
    fontSize: 12,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textMuted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ageRange: {
    fontSize: 11,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textMuted,
    backgroundColor: 'rgba(47, 107, 79, 0.1)',
    paddingHorizontal: EXPLORE_SPACING.sm,
    paddingVertical: 2,
    borderRadius: 4,
  },
});

export default RecommendedCard;
