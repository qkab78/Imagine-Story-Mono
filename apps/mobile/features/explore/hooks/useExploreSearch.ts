import { useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import useExploreStore from '@/store/explore/exploreStore';
import { useStoryList } from '@/features/stories/hooks/useStoryList';
import type { SearchResult } from '@/types/explore';
import { STORY_EMOJIS } from '@/constants/explore';
import type { StoryListItem } from '@/domain/stories/value-objects/StoryListItem';

const filterSearchResults = (
  query: string,
  stories: StoryListItem[] | undefined,
): SearchResult[] => {
  if (!query || query.length < 2 || !stories) return [];
  const q = query.toLowerCase();
  return stories
    .filter(
      (story) =>
        story.title.toLowerCase().includes(q) ||
        story.protagonist.toLowerCase().includes(q) ||
        story.synopsis.toLowerCase().includes(q)
    )
    .map((story, index) => ({
      id: story.id.getValue().toString(),
      title: story.title,
      coverImageUrl: story.coverImageUrl?.getValue(),
      ageRange: story.childAge.getValue().toString(),
      chapters: story.numberOfChapters,
      emoji: STORY_EMOJIS[index % STORY_EMOJIS.length],
    }));
};

export const useExploreSearch = () => {
  const {
    searchQuery,
    setSearchQuery,
    addToSearchHistory,
    searchHistory,
    isSearchFocused,
    setIsSearching,
    activeCategory,
    selectedAgeGroup,
  } = useExploreStore();

  const debouncedQuery = useDebounce(searchQuery, 300);

  const { data: allStories, isLoading } = useStoryList();

  // Filter stories by search query
  const searchResults: SearchResult[] = filterSearchResults(debouncedQuery, allStories);

  // Update isSearching state
  useEffect(() => {
    setIsSearching(debouncedQuery.length >= 2);
  }, [debouncedQuery, setIsSearching]);

  // Add to history when selecting a result
  const selectResult = (storyId: string) => {
    if (searchQuery.trim().length >= 2) {
      addToSearchHistory(searchQuery.trim());
    }
  };

  // Set query from history
  const selectHistoryItem = (query: string) => {
    setSearchQuery(query);
  };

  return {
    searchQuery,
    setSearchQuery,
    searchResults,
    searchHistory,
    isSearchFocused,
    isSearching: debouncedQuery.length >= 2,
    isLoading,
    selectResult,
    selectHistoryItem,
    activeCategory,
    selectedAgeGroup,
  };
};

export default useExploreSearch;
