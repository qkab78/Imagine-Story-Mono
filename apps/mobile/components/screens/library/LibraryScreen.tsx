import { useState, useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LibraryHeader, LibraryStoryGrid } from '@/components/organisms/library';
import { FilterSheet } from '@/components/organisms/filters';
import { useLibraryStories } from '@/features/library/hooks';
import { useStoryFilters } from '@/features/filters';
import { LIBRARY_COLORS } from '@/constants/library';

export const LibraryScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const {
    stories,
    isLoading,
    highlightedStoryId,
    newStoryIds,
    clearHighlight,
    totalCount,
  } = useLibraryStories();

  const {
    filters,
    toggleTheme,
    toggleTone,
    resetFilters,
    applyFilters,
    activeFiltersCount,
  } = useStoryFilters();

  // Clear highlight when leaving screen
  useEffect(() => {
    return () => {
      clearHighlight();
    };
  }, [clearHighlight]);

  // Apply filters to stories
  const filteredStories = useMemo(
    () => applyFilters(stories),
    [stories, applyFilters]
  );

  const handleStoryPress = useCallback(
    (storyId: string) => {
      const story = stories.find((s) => s.id === storyId);
      if (story) {
        router.push(`/stories/${story.id}/reader`);
      }
    },
    [stories, router]
  );

  const handleFilterPress = useCallback(() => {
    setIsFilterSheetOpen(true);
  }, []);

  const handleFilterSheetClose = useCallback(() => {
    setIsFilterSheetOpen(false);
  }, []);

  const handleCreateStoryPress = useCallback(() => {
    router.push('/create');
  }, [router]);

  return (
    <LinearGradient
      colors={[LIBRARY_COLORS.backgroundTop, LIBRARY_COLORS.backgroundBottom]}
      style={styles.container}
    >
      <View style={[styles.content, { paddingTop: insets.top }]}>
        <LibraryHeader
          storyCount={totalCount}
          onFilterPress={handleFilterPress}
          activeFiltersCount={activeFiltersCount}
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

      <FilterSheet
        visible={isFilterSheetOpen}
        onClose={handleFilterSheetClose}
        selectedThemes={filters.themes}
        selectedTones={filters.tones}
        onToggleTheme={toggleTheme}
        onToggleTone={toggleTone}
        onReset={resetFilters}
      />
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
