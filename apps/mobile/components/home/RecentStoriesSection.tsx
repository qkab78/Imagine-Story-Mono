import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { StoryListItem } from '@/domain/stories/value-objects/StoryListItem';
import { StoryCard } from '@/components/molecules/story/StoryCard';
import Text from '@/components/ui/Text';
import { useAppTranslation } from '@/hooks/useAppTranslation';
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
  const { t } = useAppTranslation('stories');

  if (stories.length === 0 && !isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('home.recentStories')}</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {t('home.noStories')}
          </Text>
          <Text style={styles.emptySubtext}>
            {t('home.noStoriesSubtitle')}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('home.recentStories')}</Text>
      </View>

      <View style={styles.listContainer}>
        <FlashList
          data={stories}
          keyExtractor={(item) => item.id.getValue()}
          renderItem={({ item }) => (
            <StoryCard
              story={item}
              onPress={onStoryPress}
              onLongPress={onStoryLongPress}
            />
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
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.base,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  separator: {
    height: spacing.sm,
    borderBottomWidth: 3,
    borderBottomColor: colors.cardBorder,
  },
  emptyContainer: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: spacing.xl * 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
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
