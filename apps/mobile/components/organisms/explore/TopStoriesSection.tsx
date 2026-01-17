import { View, StyleSheet } from 'react-native';
import { SectionTitle } from '@/components/atoms/explore';
import { TopStoryItem } from '@/components/molecules/explore';
import { EXPLORE_COLORS, EXPLORE_SPACING } from '@/constants/explore';
import type { TopStory } from '@/types/explore';

interface TopStoriesSectionProps {
  stories: TopStory[];
  onStoryPress: (storyId: string) => void;
  onSeeAll?: () => void;
}

export const TopStoriesSection: React.FC<TopStoriesSectionProps> = ({
  stories,
  onStoryPress,
  onSeeAll,
}) => {
  if (stories.length === 0) return null;

  return (
    <>
      <SectionTitle
        title="Top Histoires"
        emoji="🔥"
        showSeeAll={!!onSeeAll}
        onSeeAll={onSeeAll}
      />
      <View style={styles.container}>
        <View style={styles.card}>
          {stories.map((story, index) => (
            <View key={story.id}>
              <TopStoryItem
                story={story}
                onPress={() => onStoryPress(story.id)}
              />
              {index < stories.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: EXPLORE_SPACING.xl,
    marginBottom: EXPLORE_SPACING.xxl,
  },
  card: {
    backgroundColor: EXPLORE_COLORS.surface,
    borderRadius: 20,
    paddingVertical: EXPLORE_SPACING.sm,
    shadowColor: EXPLORE_COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(47, 107, 79, 0.08)',
    marginHorizontal: EXPLORE_SPACING.lg,
  },
});

export default TopStoriesSection;
