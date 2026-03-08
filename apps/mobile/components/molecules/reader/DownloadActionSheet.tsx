import { View, Text, Modal, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DualIcon } from '@/components/ui/DualIcon';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { READER_COLORS, READER_SPACING } from '@/constants/reader';
import type { DownloadStatus } from '@/types/offline';
import type { PdfStatus } from '@/hooks/usePdfDownload';

const ICONS = {
  offlineDownload: { sfSymbol: 'icloud.and.arrow.down', lucide: 'Download' },
  pdfExport: { sfSymbol: 'doc.text', lucide: 'FileText' },
  check: { sfSymbol: 'checkmark.circle', lucide: 'CheckCircle' },
} as const;

interface DownloadActionSheetProps {
  visible: boolean;
  onClose: () => void;
  // Offline download
  offlineStatus: DownloadStatus;
  onOfflineDownload: () => void;
  offlineDisabled: boolean;
  // PDF export
  pdfStatus: PdfStatus;
  onPdfExport: () => void;
}

export const DownloadActionSheet: React.FC<DownloadActionSheetProps> = ({
  visible,
  onClose,
  offlineStatus,
  onOfflineDownload,
  offlineDisabled,
  pdfStatus,
  onPdfExport,
}) => {
  const { t } = useAppTranslation('stories');
  const insets = useSafeAreaInsets();

  const isOfflineDownloaded = offlineStatus === 'downloaded';
  const isOfflineDownloading = offlineStatus === 'downloading';
  const isPdfDownloading = pdfStatus === 'downloading';

  const handleOfflinePress = () => {
    if (!offlineDisabled && !isOfflineDownloaded && !isOfflineDownloading) {
      onOfflineDownload();
    }
  };

  const handlePdfPress = () => {
    if (!isPdfDownloading) {
      onPdfExport();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[styles.sheet, { paddingBottom: insets.bottom + READER_SPACING.lg }]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Save Offline Option */}
          <Pressable
            onPress={handleOfflinePress}
            disabled={offlineDisabled || isOfflineDownloaded}
            style={({ pressed }) => [
              styles.option,
              (offlineDisabled || isOfflineDownloaded) && styles.optionDisabled,
              pressed && !offlineDisabled && !isOfflineDownloaded && styles.optionPressed,
            ]}
          >
            <View style={styles.optionIcon}>
              {isOfflineDownloading ? (
                <ActivityIndicator size="small" color={READER_COLORS.primary} />
              ) : isOfflineDownloaded ? (
                <DualIcon icon={ICONS.check} size={22} color={READER_COLORS.primary} />
              ) : (
                <DualIcon icon={ICONS.offlineDownload} size={22} color={READER_COLORS.textPrimary} />
              )}
            </View>
            <View style={styles.optionContent}>
              <Text style={[
                styles.optionTitle,
                isOfflineDownloaded && styles.optionTitleMuted,
              ]}>
                {t('reader.saveOffline')}
              </Text>
              {isOfflineDownloaded && (
                <Text style={styles.optionSubtitle}>{t('reader.alreadySaved')}</Text>
              )}
            </View>
          </Pressable>

          {/* Export PDF Option */}
          <Pressable
            onPress={handlePdfPress}
            disabled={isPdfDownloading}
            style={({ pressed }) => [
              styles.option,
              pressed && !isPdfDownloading && styles.optionPressed,
            ]}
          >
            <View style={styles.optionIcon}>
              {isPdfDownloading ? (
                <ActivityIndicator size="small" color={READER_COLORS.primary} />
              ) : (
                <DualIcon icon={ICONS.pdfExport} size={22} color={READER_COLORS.textPrimary} />
              )}
            </View>
            <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>
                {isPdfDownloading ? t('reader.downloadingPdf') : t('reader.exportPdf')}
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: READER_COLORS.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: READER_SPACING.md,
    paddingHorizontal: READER_SPACING.xl,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: READER_COLORS.separator,
    alignSelf: 'center',
    marginBottom: READER_SPACING.xl,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: READER_SPACING.lg,
    paddingHorizontal: READER_SPACING.md,
    borderRadius: 12,
    marginBottom: READER_SPACING.sm,
  },
  optionDisabled: {
    opacity: 0.6,
  },
  optionPressed: {
    backgroundColor: READER_COLORS.progressBackground,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: READER_COLORS.progressBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: READER_SPACING.md,
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: READER_COLORS.textPrimary,
  },
  optionTitleMuted: {
    color: READER_COLORS.textMuted,
  },
  optionSubtitle: {
    fontSize: 13,
    fontFamily: 'Nunito',
    color: READER_COLORS.textMuted,
    marginTop: 2,
  },
});

export default DownloadActionSheet;
