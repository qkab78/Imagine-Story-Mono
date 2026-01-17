import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { DualIcon } from '@/components/ui/DualIcon';
import useExploreStore from '@/store/explore/exploreStore';
import {
  EXPLORE_COLORS,
  EXPLORE_SPACING,
  EXPLORE_ICONS,
} from '@/constants/explore';
import type { SearchResult } from '@/types/explore';

interface SearchResultsSectionProps {
  results: SearchResult[];
  isLoading?: boolean;
  onStoryPress: (storyId: string) => void;
  onHistoryItemPress: (query: string) => void;
}

export const SearchResultsSection: React.FC<SearchResultsSectionProps> = ({
  results,
  isLoading = false,
  onStoryPress,
  onHistoryItemPress,
}) => {
  const { searchQuery, searchHistory, removeFromSearchHistory } = useExploreStore();

  const showHistory = searchQuery.length === 0 && searchHistory.length > 0;
  const showResults = searchQuery.length >= 2;
  const showNoResults = showResults && results.length === 0 && !isLoading;

  return (
    <View style={styles.container}>
      {/* Search History */}
      {showHistory && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <DualIcon
              icon={EXPLORE_ICONS.clock}
              size={16}
              color={EXPLORE_COLORS.textMuted}
            />
            <Text style={styles.sectionTitle}>Recherches récentes</Text>
          </View>
          {searchHistory.map((query, index) => (
            <Pressable
              key={`${query}-${index}`}
              style={styles.historyItem}
              onPress={() => onHistoryItemPress(query)}
            >
              <Text style={styles.historyText}>{query}</Text>
              <Pressable
                onPress={() => removeFromSearchHistory(query)}
                hitSlop={8}
              >
                <DualIcon
                  icon={EXPLORE_ICONS.close}
                  size={14}
                  color={EXPLORE_COLORS.textMuted}
                />
              </Pressable>
            </Pressable>
          ))}
        </View>
      )}

      {/* Loading */}
      {isLoading && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>Recherche en cours...</Text>
        </View>
      )}

      {/* No Results */}
      {showNoResults && (
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>
            Aucune histoire trouvée pour "{searchQuery}"
          </Text>
        </View>
      )}

      {/* Search Results */}
      {showResults && results.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.resultsCount}>
            {results.length} résultat{results.length > 1 ? 's' : ''}
          </Text>
          {results.map((result) => (
            <Pressable
              key={result.id}
              style={styles.resultItem}
              onPress={() => onStoryPress(result.id)}
            >
              <LinearGradient
                colors={[EXPLORE_COLORS.primary, EXPLORE_COLORS.secondary]}
                style={styles.resultCover}
              >
                <Text style={styles.resultEmoji}>{result.emoji}</Text>
              </LinearGradient>
              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle} numberOfLines={1}>
                  {result.title}
                </Text>
                <Text style={styles.resultMeta}>
                  {result.ageRange} • {result.chapters} chapitres
                </Text>
              </View>
              <DualIcon
                icon={EXPLORE_ICONS.chevronRight}
                size={16}
                color={EXPLORE_COLORS.textMuted}
              />
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: EXPLORE_SPACING.xl,
  },
  section: {
    marginBottom: EXPLORE_SPACING.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: EXPLORE_SPACING.sm,
    marginBottom: EXPLORE_SPACING.md,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textMuted,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: EXPLORE_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47, 107, 79, 0.08)',
  },
  historyText: {
    fontSize: 15,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textPrimary,
  },
  messageContainer: {
    alignItems: 'center',
    paddingVertical: EXPLORE_SPACING.xxxl,
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textMuted,
    textAlign: 'center',
  },
  resultsCount: {
    fontSize: 13,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textMuted,
    marginBottom: EXPLORE_SPACING.md,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: EXPLORE_SPACING.md,
    gap: EXPLORE_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(47, 107, 79, 0.08)',
  },
  resultCover: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultEmoji: {
    fontSize: 24,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Quicksand',
    color: EXPLORE_COLORS.textPrimary,
    marginBottom: 2,
  },
  resultMeta: {
    fontSize: 12,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textMuted,
  },
});

export default SearchResultsSection;
