import { useMemo } from 'react';
import useExploreStore from '@/store/explore/exploreStore';
import { useLatestStories, useStoryList } from '@/features/stories/hooks/useStoryList';
import type {
  FeaturedStory,
  ExploreStory,
  TopStory,
  PopularTheme,
} from '@/types/explore';
import {
  STORY_EMOJIS,
  DEFAULT_STORY_GRADIENTS,
  THEME_COLORS,
} from '@/constants/explore';
import type { StoryListItem } from '@/domain/stories/value-objects/StoryListItem';

// Helper to get emoji by index
const getEmoji = (index: number): string => {
  return STORY_EMOJIS[index % STORY_EMOJIS.length];
};

// Helper to get gradient colors by index
const getGradient = (index: number): [string, string] => {
  return DEFAULT_STORY_GRADIENTS[index % DEFAULT_STORY_GRADIENTS.length];
};

// Helper to format age range display string
const formatAgeRange = (childAge: number): string => {
  return `${childAge}-${childAge + 2} ans`;
};

// Helper to check if a childAge falls within an age group range
// ageGroupId format: "3-5", "5-7", "6-8"
const isInAgeGroup = (childAge: number, ageGroupId: string): boolean => {
  const [minStr, maxStr] = ageGroupId.split('-');
  const min = parseInt(minStr, 10);
  const max = parseInt(maxStr, 10);
  return childAge >= min && childAge <= max;
};

// Transform story to FeaturedStory
const transformToFeaturedStory = (story: StoryListItem, index: number = 0): FeaturedStory => {
  const childAge = story.childAge.getValue();
  return {
    id: story.id.getValue().toString(),
    title: story.title,
    description: story.synopsis,
    ageRange: formatAgeRange(childAge),
    childAge,
    chapters: story.numberOfChapters,
    rating: 4 + Math.random(), // Placeholder rating
    gradientColors: getGradient(index),
    emoji: getEmoji(index),
    coverImageUrl: story.coverImageUrl?.getValue(),
  };
};

// Transform story to ExploreStory
const transformToExploreStory = (story: StoryListItem, index: number): ExploreStory => {
  const childAge = story.childAge.getValue();
  return {
    id: story.id.getValue().toString(),
    title: story.title,
    hero: story.protagonist,
    ageRange: formatAgeRange(childAge),
    childAge,
    chapters: story.numberOfChapters,
    rating: 4 + Math.random(), // Placeholder rating
    emoji: getEmoji(index),
    gradientColors: getGradient(index),
    coverImageUrl: story.coverImageUrl?.getValue(),
    isNew: index < 3, // First 3 are "new"
    isPopular: false,
    theme: story.theme.id.getValue().toString(),
  };
};

// Rank colors for top stories
const RANK_COLORS = [
  '#FFD700', // Gold
  '#C0C0C0', // Silver
  '#CD7F32', // Bronze
  '#2F6B4F', // Primary
  '#4A6B5A', // Secondary
  '#7FB8A0', // Tertiary
];

// Transform story to TopStory
const transformToTopStory = (story: StoryListItem, index: number): TopStory => ({
  ...transformToExploreStory(story, index),
  rank: index + 1,
  accentColor: RANK_COLORS[index] || RANK_COLORS[3],
});

// Extract popular themes from stories
const extractPopularThemes = (stories: StoryListItem[] | undefined): PopularTheme[] => {
  if (!stories) return [];

  const themeCounts: Record<string, { name: string; count: number; emoji: string }> = {};

  stories.forEach((story) => {
    if (story.theme.id.getValue().toString()) {
      const themeId = story.theme.id.getValue().toString();
      if (!themeCounts[themeId]) {
        themeCounts[themeId] = {
          name: story.theme.name,
          count: 0,
          emoji: story.theme.name.charAt(0) || '📖',
        };
      }
      themeCounts[themeId].count++;
    }
  });

  return Object.entries(themeCounts)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)
    .map(([id, data], index) => ({
      id,
      name: data.name,
      storyCount: data.count,
      emoji: data.emoji,
      gradientColors: THEME_COLORS[id] || getGradient(index),
    }));
};

export const useExplore = () => {
  const { activeCategory, selectedAgeGroup } = useExploreStore();

  // Fetch stories
  const { data: latestStories, isLoading: isLoadingLatest } = useLatestStories();
  const { data: allStories, isLoading: isLoadingAll } = useStoryList();

  // Transform and filter stories
  const featuredStory = useMemo(() => {
    if (!latestStories?.length) return null;
    return transformToFeaturedStory(latestStories[0], 0);
  }, [latestStories]);

  const newReleases = useMemo(() => {
    let stories = latestStories?.slice(0, 6).map(transformToExploreStory) || [];

    // Filter by category
    if (activeCategory !== 'all') {
      stories = stories.filter((story) => story.theme === activeCategory);
    }

    // Filter by age group using childAge
    if (selectedAgeGroup) {
      stories = stories.filter((s) => isInAgeGroup(s.childAge, selectedAgeGroup));
    }

    return stories;
  }, [latestStories, activeCategory, selectedAgeGroup]);

  const topStories = useMemo(() => {
    let stories = allStories?.slice(0, 6).map(transformToTopStory) || [];

    // Filter by category
    if (activeCategory !== 'all') {
      stories = stories.filter((story) => story.theme === activeCategory);
    }

    // Filter by age group using childAge
    if (selectedAgeGroup) {
      stories = stories.filter((story) => isInAgeGroup(story.childAge, selectedAgeGroup));
    }

    // Re-rank after filtering
    return stories.map((story, index) => ({
      ...story,
      rank: index + 1,
      accentColor: RANK_COLORS[index] || RANK_COLORS[3],
    }));
  }, [allStories, activeCategory, selectedAgeGroup]);

  const recommendedStories = useMemo(() => {
    let stories = allStories?.slice(0, 4).map(transformToExploreStory) || [];

    // Filter by age group using childAge
    if (selectedAgeGroup) {
      stories = stories.filter((story) => isInAgeGroup(story.childAge, selectedAgeGroup));
    }

    return stories;
  }, [allStories, selectedAgeGroup]);

  const popularThemes = useMemo(() => {
    return extractPopularThemes(allStories);
  }, [allStories]);

  return {
    featuredStory,
    newReleases,
    popularThemes,
    topStories,
    recommendedStories,
    isLoading: isLoadingLatest || isLoadingAll,
  };
};

export default useExplore;
