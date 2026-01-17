import { ScrollView, StyleSheet } from 'react-native';
import { SectionTitle } from '@/components/atoms/explore';
import { RecommendedCard } from '@/components/molecules/explore';
import { EXPLORE_SPACING } from '@/constants/explore';
import type { ExploreStory } from '@/types/explore';

interface RecommendedSectionProps {
  stories: ExploreStory[];
  onStoryPress: (storyId: string) => void;
}

export const RecommendedSection: React.FC<RecommendedSectionProps> = ({
  stories,
  onStoryPress,
}) => {
  if (stories.length === 0) return null;

  return (
    <>
      <SectionTitle title="Recommandées pour vous" emoji="👋" />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {stories.map((story) => (
          <RecommendedCard
            key={story.id}
            story={story}
            onPress={() => onStoryPress(story.id)}
          />
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginBottom: EXPLORE_SPACING.xxl,
  },
  scrollContent: {
    paddingHorizontal: EXPLORE_SPACING.xl,
    gap: EXPLORE_SPACING.md,
  },
});

export default RecommendedSection;
