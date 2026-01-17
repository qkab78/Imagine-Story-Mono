import { FeaturedStoryCard } from '@/components/molecules/explore';
import type { FeaturedStory } from '@/types/explore';

interface FeaturedSectionProps {
  story: FeaturedStory | null;
  onStoryPress: (storyId: string) => void;
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({
  story,
  onStoryPress,
}) => {
  if (!story) return null;

  return (
    <FeaturedStoryCard
      story={story}
      onPress={() => onStoryPress(story.id)}
    />
  );
};

export default FeaturedSection;
