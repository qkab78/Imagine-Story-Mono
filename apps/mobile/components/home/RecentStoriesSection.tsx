import React from 'react';
import { StyleSheet, View } from 'react-native';
import { StoryListItem } from '@/domain/stories/value-objects/StoryListItem';
import { StoryCard } from '@/components/molecules/story/StoryCard';
import Text from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface RecentStoriesSectionProps {
  stories: StoryListItem[];
  onStoryPress: (storyId: string) => void;
  onStoryLongPress?: (storyId: string) => void;
  isLoading?: boolean;
}

const RecentStoriesSection: React.FC<RecentStoriesSectionProps> = ({
  stories,
  onStoryPress,
  onStoryLongPress,
  isLoading = false,
}) => {
  if (stories.length === 0 && !isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>✨ Histoires récentes</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Aucune histoire pour le moment
          </Text>
          <Text style={styles.emptySubtext}>
            Crée ta première histoire magique !
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ Histoires récentes</Text>
      </View>

      <View style={styles.listContainer}>
        {stories.map((story, index) => (
          <View key={story.id.getValue()}>
            <StoryCard
              story={story}
              onPress={onStoryPress}
              onLongPress={onStoryLongPress}
            />
            {index < stories.length - 1 && <View style={styles.separator} />}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.xs,
  },
  header: {
    marginBottom: spacing.base,
  },
  title: {
    fontSize: typography.fontSize.lg,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '700',
    color: colors.safetyGreen,
  },
  listContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.lg,
    padding: spacing.base,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  separator: {
    height: spacing.sm,
  },
  emptyContainer: {
    backgroundColor: colors.cardBackground,
    borderRadius: spacing.lg,
    padding: spacing.xl * 2,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  emptyText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '600',
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default RecentStoriesSection;
