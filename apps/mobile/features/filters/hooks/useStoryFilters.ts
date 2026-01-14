import { useMemo, useCallback } from 'react';
import useFilterStore, { StoryFilters } from '@/store/filters/filterStore';
import { LibraryStory } from '@/types/library';

/**
 * Hook for filtering stories based on active filters
 */
export const useStoryFilters = () => {
  const {
    filters,
    toggleTheme,
    toggleTone,
    setCompletedOnly,
    resetFilters,
    getActiveFiltersCount,
    hasActiveFilters,
  } = useFilterStore();

  /**
   * Filter stories based on current filter state
   */
  const applyFilters = useCallback(
    (stories: LibraryStory[]): LibraryStory[] => {
      return stories.filter((story) => {
        // Filter by themes
        if (filters.themes.length > 0) {
          if (!filters.themes.includes(story.theme.id)) {
            return false;
          }
        }

        // Filter by completed only
        if (filters.completedOnly) {
          if (story.generationStatus !== 'completed') {
            return false;
          }
        }

        return true;
      });
    },
    [filters]
  );

  /**
   * Get count of active filters
   */
  const activeFiltersCount = useMemo(
    () => getActiveFiltersCount(),
    [filters, getActiveFiltersCount]
  );

  /**
   * Check if any filters are active
   */
  const isFiltering = useMemo(
    () => hasActiveFilters(),
    [filters, hasActiveFilters]
  );

  return {
    filters,
    toggleTheme,
    toggleTone,
    setCompletedOnly,
    resetFilters,
    applyFilters,
    activeFiltersCount,
    isFiltering,
  };
};

export default useStoryFilters;
