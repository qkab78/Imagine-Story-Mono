import { useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import {
  ExploreHeader,
  SearchBar,
  CategoryList,
} from '@/components/molecules/explore';
import {
  FeaturedSection,
  NewReleasesSection,
  PopularThemesSection,
  TopStoriesSection,
  RecommendedSection,
  AgeGroupSection,
  SearchResultsSection,
} from '@/components/organisms/explore';
import { useExplore, useExploreSearch } from '@/features/explore/hooks';
import useExploreStore from '@/store/explore/exploreStore';
import { EXPLORE_COLORS, EXPLORE_SPACING } from '@/constants/explore';
import useSearchContext from '@/hooks/useSearchContext';

export const ExploreScreen: React.FC = () => {
  const router = useRouter();

  // Register as searchable page
  const setCurrentPage = useSearchContext((state) => state.setCurrentPage);

  useEffect(() => {
    setCurrentPage('search/index');
  }, [setCurrentPage]);

  const {
    featuredStory,
    newReleases,
    popularThemes,
    topStories,
    recommendedStories,
    isLoading,
  } = useExplore();

  const {
    searchResults,
    isSearchFocused,
    isSearching,
    isLoading: isSearchLoading,
    selectResult,
    selectHistoryItem,
  } = useExploreSearch();

  const showSearchResults = isSearchFocused || isSearching;

  const handleStoryPress = (storyId: string) => {
    selectResult(storyId);
    router.push(`/stories/${storyId}/reader`);
  };

  const handleThemePress = (themeId: string) => {
    // Could filter by theme or navigate to theme page
    useExploreStore.getState().setActiveCategory(themeId);
  };

  const handleHistoryItemPress = (query: string) => {
    selectHistoryItem(query);
  };

  if (isLoading && !showSearchResults) {
    return (
      <LinearGradient
        colors={[
          EXPLORE_COLORS.backgroundTop,
          EXPLORE_COLORS.backgroundMiddle,
          EXPLORE_COLORS.backgroundBottom,
        ]}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color={EXPLORE_COLORS.primary} />
        <Text style={styles.loadingText}>Chargement...</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[
        EXPLORE_COLORS.backgroundTop,
        EXPLORE_COLORS.backgroundMiddle,
        EXPLORE_COLORS.backgroundBottom,
      ]}
      style={styles.container}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.scrollContent}
      >
        <ExploreHeader />
        <SearchBar />

        {showSearchResults ? (
          <SearchResultsSection
            results={searchResults}
            isLoading={isSearchLoading}
            onStoryPress={handleStoryPress}
            onHistoryItemPress={handleHistoryItemPress}
          />
        ) : (
          <>
            <CategoryList />
            <FeaturedSection
              story={featuredStory}
              onStoryPress={handleStoryPress}
            />
            <NewReleasesSection
              stories={newReleases}
              onStoryPress={handleStoryPress}
            />
            <PopularThemesSection
              themes={popularThemes}
              onThemePress={handleThemePress}
            />
            <TopStoriesSection
              stories={topStories}
              onStoryPress={handleStoryPress}
            />
            <RecommendedSection
              stories={recommendedStories}
              onStoryPress={handleStoryPress}
            />
            <AgeGroupSection />
          </>
        )}

        {/* Bottom spacing */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: EXPLORE_SPACING.lg,
    fontSize: 16,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textMuted,
  },
  bottomSpacer: {
    height: 100, // Extra space for tab bar
  },
});

export default ExploreScreen;
