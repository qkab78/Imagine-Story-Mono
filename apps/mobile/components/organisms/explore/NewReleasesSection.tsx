import { ScrollView, StyleSheet } from 'react-native';
import { SectionTitle } from '@/components/atoms/explore';
import { NewReleaseCard } from '@/components/molecules/explore';
import { EXPLORE_SPACING } from '@/constants/explore';
import type { ExploreStory } from '@/types/explore';

interface NewReleasesSectionProps {
  stories: ExploreStory[];
  onStoryPress: (storyId: string) => void;
  onSeeAll?: () => void;
}

export const NewReleasesSection: React.FC<NewReleasesSectionProps> = ({
  stories,
  onStoryPress,
  onSeeAll,
}) => {
  if (stories.length === 0) return null;

  return (
    <>
      <SectionTitle
        title="Nouveautés"
        emoji="✨"
        showSeeAll={!!onSeeAll}
        onSeeAll={onSeeAll}
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        {stories.map((story) => (
          <NewReleaseCard
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

export default NewReleasesSection;
