import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { StyleCard } from '@/components/molecules/creation/StyleCard';
import type { IllustrationStyleOption, IllustrationStyle } from '@/types/creation';

const { width } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (width - 56 - CARD_GAP) / 2; // 28px padding on each side + gap

interface StyleSelectionGridProps {
  /** Available style options */
  options: IllustrationStyleOption[];

  /** Currently selected style ID */
  selectedId: IllustrationStyle | undefined;

  /** Callback when a style is selected */
  onSelect: (style: IllustrationStyle) => void;
}

/**
 * StyleSelectionGrid - Organism for displaying illustration style options
 *
 * Displays a 2-column grid of style cards for selection.
 * Used in the illustration style selection screen.
 *
 * @example
 * ```tsx
 * <StyleSelectionGrid
 *   options={ILLUSTRATION_STYLES}
 *   selectedId={selectedStyle}
 *   onSelect={setSelectedStyle}
 * />
 * ```
 */
export const StyleSelectionGrid: React.FC<StyleSelectionGridProps> = ({
  options,
  selectedId,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {options.map((option) => (
          <View key={option.id} style={styles.cardWrapper}>
            <StyleCard
              id={option.id}
              name={option.name}
              description={option.description}
              emoji={option.emoji}
              gradientColors={option.gradientColors}
              isSelected={selectedId === option.id}
              onPress={() => onSelect(option.id)}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: CARD_GAP,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
});

export default StyleSelectionGrid;
