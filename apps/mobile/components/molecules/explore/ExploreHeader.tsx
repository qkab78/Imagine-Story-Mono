import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  EXPLORE_COLORS,
  EXPLORE_SPACING,
  EXPLORE_DIMENSIONS,
  EXPLORE_TYPOGRAPHY,
} from '@/constants/explore';

export const ExploreHeader: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + EXPLORE_SPACING.lg }]}>
      <Text style={styles.title}>Explorer</Text>
      <View style={styles.goldLine} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: EXPLORE_SPACING.xl,
    paddingBottom: EXPLORE_SPACING.lg,
  },
  title: {
    fontSize: EXPLORE_DIMENSIONS.headerTitleSize,
    fontWeight: EXPLORE_TYPOGRAPHY.headerTitle.fontWeight,
    fontFamily: 'Quicksand',
    color: EXPLORE_COLORS.textPrimary,
    marginBottom: EXPLORE_SPACING.sm,
  },
  goldLine: {
    width: EXPLORE_DIMENSIONS.goldLineWidth,
    height: EXPLORE_DIMENSIONS.goldLineHeight,
    backgroundColor: EXPLORE_COLORS.goldLine,
    borderRadius: EXPLORE_DIMENSIONS.goldLineHeight / 2,
  },
});

export default ExploreHeader;
