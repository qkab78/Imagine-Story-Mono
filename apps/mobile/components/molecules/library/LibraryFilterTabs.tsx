import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LibraryFilterType } from '@/types/library';
import { LIBRARY_COLORS, LIBRARY_DIMENSIONS, LIBRARY_TYPOGRAPHY, LIBRARY_SPACING } from '@/constants/library';

interface LibraryFilterTabsProps {
  activeFilter: LibraryFilterType;
  onFilterChange: (filter: LibraryFilterType) => void;
}

const FILTERS: { key: LibraryFilterType; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'generating', label: 'En cours' },
  { key: 'completed', label: 'Terminées' },
];

export const LibraryFilterTabs: React.FC<LibraryFilterTabsProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  return (
    <View style={styles.container}>
      {FILTERS.map((filter) => {
        const isActive = activeFilter === filter.key;

        return (
          <Pressable
            key={filter.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onFilterChange(filter.key)}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: LIBRARY_SPACING.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    padding: 6,
    borderRadius: LIBRARY_DIMENSIONS.filterContainerBorderRadius,
    marginHorizontal: LIBRARY_SPACING.xxl,
    marginBottom: LIBRARY_SPACING.lg,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: LIBRARY_SPACING.lg,
    borderRadius: LIBRARY_DIMENSIONS.filterTabBorderRadius,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  tabText: {
    ...LIBRARY_TYPOGRAPHY.filterTab,
    color: LIBRARY_COLORS.textSecondary,
  },
  tabTextActive: {
    color: LIBRARY_COLORS.primary,
  },
});

export default LibraryFilterTabs;
