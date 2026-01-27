import { View, TextInput, Pressable, StyleSheet } from 'react-native';
import { DualIcon } from '@/components/ui/DualIcon';
import useExploreStore from '@/store/explore/exploreStore';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import {
  EXPLORE_COLORS,
  EXPLORE_SPACING,
  EXPLORE_DIMENSIONS,
  EXPLORE_TYPOGRAPHY,
  EXPLORE_ICONS,
} from '@/constants/explore';

interface SearchBarProps {
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
}) => {
  const { t } = useAppTranslation('stories');
  const searchPlaceholder = placeholder || t('explore.searchPlaceholder');
  const { searchQuery, setSearchQuery, clearSearchQuery, setIsSearchFocused } =
    useExploreStore();

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <DualIcon
          icon={EXPLORE_ICONS.search}
          size={20}
          color={EXPLORE_COLORS.textMuted}
        />
        <TextInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          placeholder={searchPlaceholder}
          placeholderTextColor={EXPLORE_COLORS.textMuted}
          style={styles.input}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={clearSearchQuery} hitSlop={8}>
            <DualIcon
              icon={EXPLORE_ICONS.close}
              size={18}
              color={EXPLORE_COLORS.textMuted}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: EXPLORE_SPACING.xl,
    marginBottom: EXPLORE_SPACING.lg,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: EXPLORE_COLORS.searchBackground,
    borderRadius: EXPLORE_DIMENSIONS.searchBorderRadius,
    height: EXPLORE_DIMENSIONS.searchHeight,
    paddingHorizontal: EXPLORE_SPACING.lg,
    gap: EXPLORE_SPACING.md,
    shadowColor: EXPLORE_COLORS.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: EXPLORE_TYPOGRAPHY.searchPlaceholder.fontSize,
    fontFamily: 'Nunito',
    color: EXPLORE_COLORS.textPrimary,
  },
});

export default SearchBar;
