import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FilterOption } from '@/components/atoms/filters';
import { LIBRARY_COLORS, LIBRARY_SPACING } from '@/constants/library';

interface FilterItem {
  id: string;
  label: string;
  icon?: {
    sfSymbol: string;
    lucide: string;
  };
}

interface FilterSectionProps {
  title: string;
  items: FilterItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  horizontal?: boolean;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  items,
  selectedIds,
  onToggle,
  horizontal = false,
}) => {
  const selectedCount = selectedIds.length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {selectedCount > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{selectedCount}</Text>
          </View>
        )}
      </View>

      {horizontal ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalList}
        >
          {items.map((item) => (
            <FilterOption
              key={item.id}
              label={item.label}
              icon={item.icon}
              isSelected={selectedIds.includes(item.id)}
              onPress={() => onToggle(item.id)}
            />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.grid}>
          {items.map((item) => (
            <View key={item.id} style={styles.gridItem}>
              <FilterOption
                label={item.label}
                icon={item.icon}
                isSelected={selectedIds.includes(item.id)}
                onPress={() => onToggle(item.id)}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: LIBRARY_SPACING.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: LIBRARY_SPACING.md,
    gap: LIBRARY_SPACING.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: LIBRARY_COLORS.textPrimary,
  },
  countBadge: {
    backgroundColor: LIBRARY_COLORS.accent,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'white',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: LIBRARY_SPACING.md,
  },
  gridItem: {
    width: '31%',
  },
  horizontalList: {
    gap: LIBRARY_SPACING.md,
    paddingRight: LIBRARY_SPACING.md,
  },
});

export default FilterSection;
