import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  SafeAreaView, 
  Pressable, 
  TextInput,
  FlatList,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
  withSpring,
} from 'react-native-reanimated';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { getLatestStories, getSuggestedStories, getStories } from '@/api/stories';
import { colors } from '../../../theme/colors';
import { spacing } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';
import useAuthStore from '@/store/auth/authStore';
import { Story } from '@imagine-story/api/stories/entities';

const { width } = Dimensions.get('window');

// Interfaces TypeScript
interface DiscoverStory {
  id: string;
  title: string;
  emoji?: string;
  ageRange?: string;
  chapters?: number;
  category?: string;
  isNew?: boolean;
  isPopular?: boolean;
  slug: string;
  cover_image?: string;
  theme?: string;
  tone?: string;
  childAge?: number;
  numberOfChapters?: number;
}

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
}

interface StoryCardProps {
  story: DiscoverStory;
  variant?: 'horizontal' | 'vertical';
  onPress: (story: DiscoverStory) => void;
}

interface SectionProps {
  title: string;
  emoji: string;
  children: React.ReactNode;
}

interface HorizontalStoriesProps {
  stories: DiscoverStory[];
  onStoryPress: (story: DiscoverStory) => void;
  isLoading?: boolean;
}

interface VerticalStoriesProps {
  stories: DiscoverStory[];
  onStoryPress: (story: DiscoverStory) => void;
  isLoading?: boolean;
}

// Utilitaire pour debouncing
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Mapping des thèmes vers emojis
const getThemeEmoji = (theme?: string) => {
  const themeMap: Record<string, string> = {
    'fantasy': '🏰',
    'adventure': '🌊',
    'science-fiction': '🚀',
    'historical': '🏛️',
    'detective': '🔍',
    'comedy': '😄',
    'fable': '📚',
    'myth': '⚡',
    'legend': '🌟',
  };
  return themeMap[theme?.toLowerCase() || ''] || '📖';
};

// Conversion Stories vers DiscoverStory
const mapStoriestoDiscoverStory = (stories: Story[]): DiscoverStory[] => {
  return stories.map(story => ({
    id: story.id as unknown as string,
    title: story.title,
    emoji: getThemeEmoji(story.theme as unknown as string),
    ageRange: `${story.childAge || 4}-${(story.childAge || 4) + 2} ans`,
    chapters: story.numberOfChapters,
    category: story.theme as unknown as string,
    slug: story.slug || '',
    cover_image: story.coverImage,
    theme: story.theme as unknown as string,
    tone: story.tone as unknown as string,
    childAge: story.childAge as unknown as number,
    numberOfChapters: story.numberOfChapters,
    isNew: true, // Pour les nouvelles histoires
    isPopular: Math.random() > 0.7, // Logique temporaire pour populaires
  }));
};

// Composant SearchBar avec animations
const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChangeText, 
  placeholder = "Rechercher des histoires...",
  onFocus,
  onBlur 
}) => {
  const focusScale = useSharedValue(1);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
    focusScale.value = withSpring(1.02);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    focusScale.value = withSpring(1);
    onBlur?.();
  };

  const searchBarAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: focusScale.value }],
  }));

  return (
    <Animated.View style={[styles.searchContainer, searchBarAnimatedStyle]}>
      <View style={[styles.searchBar, isFocused && styles.searchBarFocused]}>
        <Ionicons name="search" size={20} color={colors.searchPlaceholder} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={colors.searchPlaceholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>
    </Animated.View>
  );
};

// Composant StoryCard réutilisable
const StoryCard: React.FC<StoryCardProps> = ({ story, variant = 'horizontal', onPress }) => {
  const cardScale = useSharedValue(1);

  const handlePress = useCallback(() => {
    cardScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withTiming(1, { duration: 100 })
    );
    runOnJS(onPress)(story);
  }, [story, onPress]);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }));

  const isHorizontal = variant === 'horizontal';
  const cardStyle = isHorizontal ? styles.horizontalCard : styles.verticalCard;

  return (
    <Animated.View style={cardAnimatedStyle}>
      <Pressable style={cardStyle} onPress={handlePress}>
        <View style={styles.storyCardContent}>
          {/* Emoji cover */}
          <View style={[styles.storyCover, isHorizontal && styles.horizontalCover]}>
            <Text style={styles.storyCoverEmoji}>{story.emoji}</Text>
          </View>
          
          {/* Story info */}
          <View style={[styles.storyInfo, isHorizontal && styles.horizontalStoryInfo]}>
            <Text style={styles.storyTitle} numberOfLines={2}>{story.title}</Text>
            <View style={styles.storyMeta}>
              <Text style={styles.storyMetaText}>{story.ageRange}</Text>
              <Text style={styles.storyMetaText}>•</Text>
              <Text style={styles.storyMetaText}>{story.chapters} chapitres</Text>
            </View>
            
            {/* Badges */}
            <View style={styles.badgeContainer}>
              {story.isNew && (
                <View style={[styles.badge, styles.newBadge]}>
                  <Text style={styles.badgeText}>Nouveau</Text>
                </View>
              )}
              {story.isPopular && (
                <View style={[styles.badge, styles.popularBadge]}>
                  <Text style={styles.badgeText}>Populaire</Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
};

// Composant Section
const Section: React.FC<SectionProps> = ({ title, emoji, children }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{emoji} {title}</Text>
    </View>
    <View style={styles.sectionContent}>
      {children}
    </View>
  </View>
);

// Composant HorizontalStories
const HorizontalStories: React.FC<HorizontalStoriesProps> = ({ stories, onStoryPress, isLoading }) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primaryPink} />
      </View>
    );
  }

  return (
    <FlatList
      horizontal
      data={stories}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <StoryCard story={item} variant="horizontal" onPress={onStoryPress} />
      )}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalList}
    />
  );
};

// Composant VerticalStories
const VerticalStories: React.FC<VerticalStoriesProps> = ({ stories, onStoryPress, isLoading }) => {
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primaryPink} />
      </View>
    );
  }

  return (
    <View style={styles.verticalList}>
      {stories.slice(0, 5).map((story) => (
        <StoryCard key={story.id} story={story} variant="vertical" onPress={onStoryPress} />
      ))}
    </View>
  );
};

// Composant principal DiscoverScreen
const DiscoverScreen: React.FC = () => {
  const router = useRouter();
  const token = useAuthStore(state => state.token);
  
  // États
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  // Debouncing pour la recherche
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Queries
  const { data: latestStories = [], isLoading: isLoadingLatest } = useQuery({
    queryKey: ['latest-stories', token],
    queryFn: () => getLatestStories(token!),
    enabled: !!token,
  });

  const { data: allStories = [], isLoading: isLoadingAll } = useQuery({
    queryKey: ['all-stories', token],
    queryFn: () => getStories(token!),
    enabled: !!token,
  });

  const { data: searchResults = [], isLoading: isLoadingSearch } = useQuery({
    queryKey: ['search-stories', debouncedSearchQuery, token],
    queryFn: () => getSuggestedStories(token!, debouncedSearchQuery),
    enabled: !!token && debouncedSearchQuery.length > 2,
  });

  // Transformation des données
  const newStories = useMemo(() => mapStoriestoDiscoverStory(latestStories as unknown as Story[]), [latestStories]);
  const allDiscoverStories = useMemo(() => mapStoriestoDiscoverStory(allStories as unknown as Story[]), [allStories]);
  
  const recommendedStories = useMemo(() => 
    allDiscoverStories.filter(() => Math.random() > 0.5).slice(0, 6),
    [allDiscoverStories]
  );
  
  const popularStories = useMemo(() => 
    allDiscoverStories.filter(story => story.isPopular).slice(0, 5),
    [allDiscoverStories]
  );

  // Handlers
  const handleStoryPress = (story: DiscoverStory) => {
    router.push(`/stories/${story.slug}`);
  };

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
  };

  // Contenu conditionnel basé sur la recherche
  const showSearchResults = isSearchFocused && debouncedSearchQuery.length > 2;

  return (
    <LinearGradient
      colors={[colors.backgroundDiscover, colors.backgroundDiscoverEnd]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <SafeAreaView>
          <View style={styles.content}>
            {/* Barre de recherche */}
            <SearchBar
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={handleSearchFocus}
              onBlur={handleSearchBlur}
            />

            {/* Résultats de recherche ou contenu par défaut */}
            {showSearchResults ? (
              <Section title="Résultats de recherche" emoji="🔍">
                <VerticalStories 
                  stories={searchResults.map(story => ({
                    id: story.id as unknown as string,
                    title: story.title,
                    slug: story.slug || '',
                    emoji: '📖',
                    ageRange: '4-6 ans',
                    chapters: 3,
                  }))}
                  onStoryPress={handleStoryPress}
                  isLoading={isLoadingSearch}
                />
              </Section>
            ) : (
              <>
                {/* Section Nouveautés */}
                <Section title="Nouveautés" emoji="✨">
                  <HorizontalStories 
                    stories={newStories}
                    onStoryPress={handleStoryPress}
                    isLoading={isLoadingLatest}
                  />
                </Section>

                {/* Section Recommandées */}
                <Section title="Recommandées pour vous" emoji="💫">
                  <VerticalStories 
                    stories={recommendedStories}
                    onStoryPress={handleStoryPress}
                    isLoading={isLoadingAll}
                  />
                </Section>

                {/* Section Populaires */}
                <Section title="Populaires" emoji="🔥">
                  <VerticalStories 
                    stories={popularStories}
                    onStoryPress={handleStoryPress}
                    isLoading={isLoadingAll}
                  />
                </Section>
              </>
            )}
          </View>
        </SafeAreaView>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  scrollContainer: {
    flex: 1,
  },

  headerButton: {
    width: 44,
    height: 44,
    backgroundColor: colors.cardBackground,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: -0.2,
    fontFamily: typography.fontFamily.primary,
  },

  content: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  searchContainer: {
    marginBottom: spacing.xl,
  },

  searchBar: {
    backgroundColor: colors.searchBarBackground,
    borderWidth: 1,
    borderColor: colors.searchBarBorder,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.storyCardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },

  searchBarFocused: {
    borderColor: colors.primaryPink,
    shadowOpacity: 0.2,
  },

  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: typography.fontFamily.primary,
  },

  section: {
    marginBottom: spacing['2xl'],
  },

  sectionHeader: {
    marginBottom: spacing.lg,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    letterSpacing: -0.2,
    fontFamily: typography.fontFamily.primary,
  },

  sectionContent: {
    // Contenu de la section
  },

  horizontalList: {
    paddingLeft: spacing.sm,
  },

  verticalList: {
    gap: spacing.md,
  },

  horizontalCard: {
    width: width * 0.7,
    height: 150,
    backgroundColor: colors.storyCardBackground,
    borderWidth: 1,
    borderColor: colors.storyCardBorder,
    borderRadius: 16,
    padding: spacing.lg,
    marginRight: spacing.md,
    shadowColor: colors.storyCardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  verticalCard: {
    backgroundColor: colors.storyCardBackground,
    borderWidth: 1,
    borderColor: colors.storyCardBorder,
    borderRadius: 16,
    padding: spacing.lg,
    shadowColor: colors.storyCardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },

  storyCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  storyCover: {
    width: 60,
    height: 60,
    backgroundColor: colors.storyCoverGradientStart,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    shadowColor: colors.primaryPink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },

  horizontalCover: {
    width: 50,
    height: 50,
  },

  storyCoverEmoji: {
    fontSize: 24,
  },

  storyInfo: {
    flex: 1,
  },

  horizontalStoryInfo: {
    // Styles spécifiques pour les cards horizontales
  },

  storyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
    lineHeight: 22,
    fontFamily: typography.fontFamily.primary,
  },

  storyMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  storyMetaText: {
    fontSize: 12,
    color: colors.textTertiary,
    marginRight: 4,
    fontFamily: typography.fontFamily.primary,
  },

  badgeContainer: {
    flexDirection: 'row',
    gap: 6,
  },

  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  newBadge: {
    backgroundColor: colors.newBadgeBackground,
  },

  popularBadge: {
    backgroundColor: colors.popularBadgeBackground,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: colors.white,
    fontFamily: typography.fontFamily.primary,
  },

  loadingContainer: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },
});

export default DiscoverScreen;