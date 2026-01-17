import { ScrollView, StyleSheet } from 'react-native';
import { CategoryChip } from '@/components/atoms/explore';
import useExploreStore from '@/store/explore/exploreStore';
import { EXPLORE_CATEGORIES, EXPLORE_SPACING } from '@/constants/explore';

export const CategoryList: React.FC = () => {
  const { activeCategory, setActiveCategory } = useExploreStore();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {EXPLORE_CATEGORIES.map((category) => (
        <CategoryChip
          key={category.id}
          category={category}
          isActive={activeCategory === category.id}
          onPress={() => setActiveCategory(category.id)}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    marginBottom: EXPLORE_SPACING.xxl,
  },
  container: {
    paddingHorizontal: EXPLORE_SPACING.xl,
    gap: EXPLORE_SPACING.sm,
  },
});

export default CategoryList;
