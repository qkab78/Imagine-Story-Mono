
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StoryListItem as StoryListItemType } from '@/domain/stories/value-objects/StoryListItem';
import { StoryListItem, EmptyState } from '@/components/molecules/home';
import { SectionTitle } from '@/components/atoms/home';

interface RecentStoriesSectionProps {
  stories: StoryListItemType[];
  onStoryPress: (storyId: string) => void;
  isLoading?: boolean;
}

export const RecentStoriesSection: React.FC<RecentStoriesSectionProps> = ({
  stories,
  onStoryPress,
  isLoading = false,
}) => {
  if (stories.length === 0 && !isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <SectionTitle title="Histoires récentes" icon="✨" />
        </View>
        <EmptyState
          title="Aucune histoire pour le moment"
          subtitle="Crée ta première histoire magique !"
        />
      </View>
    );
  }

  // Transform domain entity to component props
  const storyItems = stories.map((story) => ({
    id: story.id.getValue(),
    title: story.title,
    chaptersCount: story.numberOfChapters,
    createdAt: story.publicationDate.toDate(),
  }));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <SectionTitle title="Histoires récentes" icon="✨" />
      </View>

      <View style={styles.listContainer}>
        <FlashList
          data={storyItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <StoryListItem story={item} onPress={onStoryPress} />
          )}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    marginTop: 4,
  },
  header: {
    marginBottom: 16,
  },
  listContainer: {
    gap: 12,
  },
  separator: {
    height: 12,
  },
});

export default RecentStoriesSection;
