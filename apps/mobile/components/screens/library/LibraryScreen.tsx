import { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LibraryHeader, LibraryStoryGrid } from '@/components/organisms/library';
import { LibraryFilterTabs } from '@/components/molecules/library';
import { useLibraryStories } from '@/features/library/hooks';
import { LibraryFilterType } from '@/types/library';
import { LIBRARY_COLORS } from '@/constants/library';

export const LibraryScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<LibraryFilterType>('all');

  const {
    stories,
    isLoading,
    highlightedStoryId,
    newStoryIds,
    filterStories,
    clearHighlight,
    totalCount,
  } = useLibraryStories();

  // Clear highlight when leaving screen
  useEffect(() => {
    return () => {
      clearHighlight();
    };
  }, [clearHighlight]);

  // Get filtered stories
  const filteredStories = filterStories(activeFilter);

  const handleStoryPress = useCallback(
    (storyId: string) => {
      const story = stories.find((s) => s.id === storyId);
      if (story) {
        router.push(`/stories/${story.slug}`);
      }
    },
    [stories, router]
  );

  const handleSearchPress = useCallback(() => {
    router.push('/search');
  }, [router]);

  const handleCreateStoryPress = useCallback(() => {
    router.push('/create');
  }, [router]);

  const handleFilterChange = useCallback((filter: LibraryFilterType) => {
    setActiveFilter(filter);
  }, []);

  return (
    <LinearGradient
      colors={[LIBRARY_COLORS.backgroundTop, LIBRARY_COLORS.backgroundBottom]}
      style={styles.container}
    >
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <LibraryHeader storyCount={totalCount} onSearchPress={handleSearchPress} />

        <LibraryFilterTabs
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={LIBRARY_COLORS.primary} />
          </View>
        ) : (
          <LibraryStoryGrid
            stories={filteredStories}
            highlightedStoryId={highlightedStoryId}
            newStoryIds={newStoryIds}
            onStoryPress={handleStoryPress}
            onCreateStoryPress={handleCreateStoryPress}
            isLoading={isLoading}
          />
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LibraryScreen;
