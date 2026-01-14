import { View, Text, StyleSheet } from 'react-native';
import { FilterChip } from '@/components/atoms/filters';
import { LIBRARY_COLORS, LIBRARY_SPACING } from '@/constants/library';

interface FilterChipItem {
  id: string;
  label: string;
  icon?: {
    sfSymbol: string;
    lucide: string;
  };
}

interface FilterChipListProps {
  title: string;
  items: FilterChipItem[];
  selectedIds: string[];
  onToggle: (id: string) => void;
}

export const FilterChipList: React.FC<FilterChipListProps> = ({
  title,
  items,
  selectedIds,
  onToggle,
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

      <View style={styles.chipList}>
        {items.map((item) => (
          <FilterChip
            key={item.id}
            label={item.label}
            icon={item.icon}
            isSelected={selectedIds.includes(item.id)}
            onPress={() => onToggle(item.id)}
          />
        ))}
      </View>
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
  chipList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: LIBRARY_SPACING.sm,
  },
});

export default FilterChipList;
