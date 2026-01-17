import type { IconConfig } from '@/components/ui/DualIcon';

/**
 * Category for filtering stories
 */
export interface ExploreCategory {
  id: string;
  name: string;
  emoji: string;
  icon: IconConfig;
}

/**
 * Icon configuration for themes
 */
export interface ThemeIconConfig {
  sfSymbol: string;
  lucide: string;
}

/**
 * Featured story displayed prominently on the explore screen
 */
export interface FeaturedStory {
  id: string;
  title: string;
  description: string;
  ageRange: string;
  childAge: number;
  chapters: number;
  rating: number;
  gradientColors: [string, string];
  emoji: string;
  coverImageUrl?: string;
}

/**
 * Story card for various sections (new releases, recommended, etc.)
 */
export interface ExploreStory {
  id: string;
  title: string;
  hero: string;
  ageRange: string;
  childAge: number;
  chapters: number;
  rating: number;
  emoji: string;
  gradientColors: [string, string];
  coverImageUrl?: string;
  isNew?: boolean;
  isPopular?: boolean;
  theme?: string;
}

/**
 * Popular theme card
 */
export interface PopularTheme {
  id: string;
  name: string;
  storyCount: number;
  icon: ThemeIconConfig;
  gradientColors: [string, string];
}

/**
 * Top story with ranking
 */
export interface TopStory extends ExploreStory {
  rank: number;
  accentColor: string;
}

/**
 * Age group for filtering
 */
export interface AgeGroup {
  id: string;
  label: string;
  emoji: string;
  color: string;
}

/**
 * Search result item
 */
export interface SearchResult {
  id: string;
  title: string;
  coverImageUrl?: string;
  ageRange: string;
  chapters: number;
  emoji: string;
}

/**
 * Search history item
 */
export interface SearchHistoryItem {
  query: string;
  timestamp: number;
}
