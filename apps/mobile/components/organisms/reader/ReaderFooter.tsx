import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { ReaderNavButton } from '@/components/atoms/reader';
import { PageIndicator, ReaderMenuButton } from '@/components/molecules/reader';
import { READER_COLORS, READER_SPACING, READER_ICONS } from '@/constants/reader';

interface ReaderFooterProps {
  currentChapter: number;
  totalChapters: number;
  onPrevious: () => void;
  onNext: () => void;
  onMenu: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}

export const ReaderFooter: React.FC<ReaderFooterProps> = ({
  currentChapter,
  totalChapters,
  onPrevious,
  onNext,
  onMenu,
  hasPrevious,
  hasNext,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + READER_SPACING.lg }]}>
      <BlurView intensity={80} tint="light" style={StyleSheet.absoluteFill} />
      <View style={styles.overlay} />
      <View style={styles.content}>
        <ReaderNavButton
          icon={READER_ICONS.previous}
          onPress={onPrevious}
          disabled={!hasPrevious}
        />

        <PageIndicator current={currentChapter} total={totalChapters} />

        <ReaderNavButton
          icon={READER_ICONS.next}
          onPress={onNext}
          disabled={!hasNext}
        />

        <ReaderMenuButton onPress={onMenu} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: READER_COLORS.separator,
    overflow: 'hidden',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: READER_COLORS.overlay,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: READER_SPACING.xl,
    paddingTop: READER_SPACING.lg,
    gap: READER_SPACING.md,
  },
});

export default ReaderFooter;
