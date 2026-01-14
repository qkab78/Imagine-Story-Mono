import { View, Text, StyleSheet } from 'react-native';
import { ProgressBar } from '@/components/atoms/reader';
import { READER_COLORS, READER_TYPOGRAPHY, READER_SPACING } from '@/constants/reader';

interface PageIndicatorProps {
  current: number;
  total: number;
}

export const PageIndicator: React.FC<PageIndicatorProps> = ({
  current,
  total,
}) => {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.pageNumber}>
        {current} sur {total}
      </Text>
      <ProgressBar progress={progress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  pageNumber: {
    fontSize: READER_TYPOGRAPHY.pageNumber.fontSize,
    fontWeight: READER_TYPOGRAPHY.pageNumber.fontWeight,
    fontFamily: 'Nunito',
    color: READER_COLORS.textMuted,
    marginBottom: READER_SPACING.xs,
  },
});

export default PageIndicator;
