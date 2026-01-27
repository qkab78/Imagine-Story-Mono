import { Text, StyleSheet } from 'react-native';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { READER_COLORS, READER_TYPOGRAPHY } from '@/constants/reader';

interface ChapterIndicatorProps {
  current: number;
  total: number;
}

export const ChapterIndicator: React.FC<ChapterIndicatorProps> = ({
  current,
  total,
}) => {
  const { t } = useAppTranslation('stories');

  return (
    <Text style={styles.text}>
      {t('reader.chapterOf', { current, total })}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: READER_TYPOGRAPHY.chapterIndicator.fontSize,
    fontWeight: READER_TYPOGRAPHY.chapterIndicator.fontWeight,
    fontFamily: 'Nunito',
    color: READER_COLORS.textMuted,
  },
});

export default ChapterIndicator;
