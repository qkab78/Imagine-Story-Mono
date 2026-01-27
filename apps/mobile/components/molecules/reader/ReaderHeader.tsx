import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReaderNavButton, ChapterIndicator } from '@/components/atoms/reader';
import { DownloadButton } from '@/components/molecules/offline';
import { READER_COLORS, READER_SPACING, READER_ICONS } from '@/constants/reader';
import type { DownloadStatus } from '@/types/offline';

interface ReaderHeaderProps {
  currentChapter: number;
  totalChapters: number;
  onBack: () => void;
  onClose: () => void;
  // Download props (optional - only shown for premium users)
  showDownload?: boolean;
  downloadStatus?: DownloadStatus;
  onDownload?: () => void;
  downloadDisabled?: boolean;
}

export const ReaderHeader: React.FC<ReaderHeaderProps> = ({
  currentChapter,
  totalChapters,
  onBack,
  onClose,
  showDownload = false,
  downloadStatus = 'idle',
  onDownload,
  downloadDisabled = false,
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
      <View style={styles.right}>
        {showDownload && onDownload && (
          <DownloadButton
            status={downloadStatus}
            onPress={onDownload}
            disabled={downloadDisabled}
            size="medium"
          />
        )}
        <ReaderNavButton
          icon={READER_ICONS.close}
          onPress={onClose}
          variant="close"
        />
      </View>
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
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: READER_SPACING.md,
  },
});

export default ReaderHeader;
