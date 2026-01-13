import React from 'react';
import { StyleSheet, View } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { GlassCard } from '@/components/molecules/glass/GlassCard';
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
        <GlassCard
          glassStyle="regular"
          tintColor="rgba(107, 70, 193, 0.05)"
          borderRadius={spacing.lg}
          padding={spacing.xl * 2}
          style={styles.emptyContainer}
        >
          <Text style={styles.emptyText}>
            Aucune histoire pour le moment
          </Text>
          <Text style={styles.emptySubtext}>
            Crée ta première histoire magique !
          </Text>
        </GlassCard>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>✨ Histoires récentes</Text>
      </View>

      <GlassCard
        glassStyle="regular"
        tintColor="rgba(107, 70, 193, 0.05)"
        borderRadius={spacing.lg}
        padding={spacing.base}
        style={styles.listContainer}
      >
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
      </GlassCard>
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
    // Background, padding, borderRadius, shadows handled by GlassCard
  },
  separator: {
    height: spacing.sm,
    borderBottomWidth: 3,
    borderBottomColor: colors.cardBorder,
  },
  emptyContainer: {
    alignItems: 'center',
    // Background, padding, borderRadius, shadows handled by GlassCard
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
