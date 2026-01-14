import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReaderNavButton, ChapterIndicator } from '@/components/atoms/reader';
import { READER_COLORS, READER_SPACING, READER_ICONS } from '@/constants/reader';

interface ReaderHeaderProps {
  currentChapter: number;
  totalChapters: number;
  onBack: () => void;
  onClose: () => void;
}

export const ReaderHeader: React.FC<ReaderHeaderProps> = ({
  currentChapter,
  totalChapters,
  onBack,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + READER_SPACING.md }]}>
      <View style={styles.left}>
        <ReaderNavButton
          icon={READER_ICONS.back}
          onPress={onBack}
          variant="back"
        />
        <ChapterIndicator current={currentChapter} total={totalChapters} />
      </View>
      <ReaderNavButton
        icon={READER_ICONS.close}
        onPress={onClose}
        variant="close"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: READER_SPACING.xl,
    paddingBottom: READER_SPACING.md,
    backgroundColor: READER_COLORS.background,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: READER_SPACING.md,
  },
});

export default ReaderHeader;
