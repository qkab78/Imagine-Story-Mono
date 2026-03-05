import { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { LibraryHeader, LibraryStoryGrid } from '@/components/organisms/library';
import { FilterSheet } from '@/components/organisms/filters';
import { useLibraryStories } from '@/features/library/hooks';
import { useStoryFilters } from '@/features/filters';
import { useStoryRetry } from '@/features/stories/hooks/useStoryRetry';
import { useStorySSE } from '@/hooks/useStorySSE';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { LIBRARY_COLORS } from '@/constants/library';

export const LibraryScreen = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { t } = useAppTranslation('stories');
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [retryingStoryId, setRetryingStoryId] = useState<string | null>(null);

  const {
    stories,
    isLoading,
    highlightedStoryId,
    newStoryIds,
    clearHighlight,
    invalidateStories,
    totalCount,
  } = useLibraryStories();

  // SSE for real-time story completion events (replaces polling)
  useStorySSE();

  const {
    filters,
    toggleTheme,
    toggleTone,
    resetFilters,
    applyFilters,
    activeFiltersCount,
  } = useStoryFilters();

  const { mutate: retryStory } = useStoryRetry();

  // Clear highlight when leaving screen
  useEffect(() => {
    return () => {
      clearHighlight();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply filters to stories
  const filteredStories = applyFilters(stories);

  const handleStoryPress = (storyId: string) => {
    const story = stories.find((s) => s.id === storyId);
    if (story) {
      router.push(`/stories/${story.id}/reader`);
    }
  };

  const handleFilterPress = () => {
    setIsFilterSheetOpen(true);
  };

  const handleFilterSheetClose = () => {
    setIsFilterSheetOpen(false);
  };

  const handleCreateStoryPress = () => {
    router.push('/stories/creation/welcome');
  };

  const handleRetryStory = (storyId: string) => {
    setRetryingStoryId(storyId);
    retryStory(storyId, {
      onSuccess: () => {
        invalidateStories();
        setRetryingStoryId(null);
      },
      onError: () => {
        Alert.alert(
          t('library.failed.retryError'),
        );
        setRetryingStoryId(null);
      },
    });
  };

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
            onRetryStory={handleRetryStory}
            onCreateStoryPress={handleCreateStoryPress}
            isLoading={isLoading}
            retryingStoryId={retryingStoryId}
            retryLabel={t('library.failed.retry')}
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
