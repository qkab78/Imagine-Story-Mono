import { View, StyleSheet } from 'react-native';
import { READER_COLORS, READER_DIMENSIONS } from '@/constants/reader';

export const ChapterDivider: React.FC = () => {
  return <View style={styles.divider} />;
};

const styles = StyleSheet.create({
  divider: {
    width: READER_DIMENSIONS.dividerWidth,
    height: READER_DIMENSIONS.dividerHeight,
    backgroundColor: READER_COLORS.accent,
    borderRadius: 2,
    alignSelf: 'center',
  },
});

export default ChapterDivider;
