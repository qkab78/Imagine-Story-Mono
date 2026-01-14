import { View, Text, Modal, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { DualIcon } from '@/components/ui/DualIcon';
import { READER_COLORS, READER_SPACING, READER_ICONS } from '@/constants/reader';
import type { ReaderChapter } from '@/types/reader';

interface ChapterMenuSheetProps {
  visible: boolean;
  onClose: () => void;
  chapters: ReaderChapter[];
  currentChapterIndex: number;
  onSelectChapter: (index: number) => void;
  storyTitle: string;
}

export const ChapterMenuSheet: React.FC<ChapterMenuSheetProps> = ({
  visible,
  onClose,
  chapters,
  currentChapterIndex,
  onSelectChapter,
  storyTitle,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={[READER_COLORS.background, '#FFE5E5']}
        style={styles.container}
      >
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + READER_SPACING.md }]}>
          <View style={styles.handle} />
          <Text style={styles.title}>Chapitres</Text>
          <Text style={styles.storyTitle} numberOfLines={1}>
            {storyTitle}
          </Text>
        </View>

        {/* Chapter List */}
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: insets.bottom + READER_SPACING.xxl },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {chapters.map((chapter, index) => {
            const isActive = index === currentChapterIndex;
            return (
              <Pressable
                key={chapter.id}
                onPress={() => onSelectChapter(index)}
                style={({ pressed }) => [
                  styles.chapterItem,
                  isActive && styles.chapterItemActive,
                  pressed && styles.chapterItemPressed,
                ]}
              >
                <View style={styles.chapterNumber}>
                  <Text
                    style={[
                      styles.chapterNumberText,
                      isActive && styles.chapterNumberTextActive,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                <View style={styles.chapterInfo}>
                  <Text
                    style={[
                      styles.chapterTitle,
                      isActive && styles.chapterTitleActive,
                    ]}
                    numberOfLines={2}
                  >
                    {chapter.title}
                  </Text>
                </View>
                {isActive && (
                  <View style={styles.checkIcon}>
                    <DualIcon
                      icon={READER_ICONS.check}
                      size={16}
                      color={READER_COLORS.primary}
                    />
                  </View>
                )}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Close Button */}
        <View style={[styles.footer, { paddingBottom: insets.bottom + READER_SPACING.lg }]}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fermer</Text>
          </Pressable>
        </View>
      </LinearGradient>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: READER_SPACING.xxl,
    paddingBottom: READER_SPACING.xl,
    borderBottomWidth: 1,
    borderBottomColor: READER_COLORS.separator,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: READER_COLORS.separator,
    marginBottom: READER_SPACING.lg,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: READER_COLORS.textPrimary,
    marginBottom: READER_SPACING.xs,
  },
  storyTitle: {
    fontSize: 14,
    fontFamily: 'Nunito',
    color: READER_COLORS.textMuted,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: READER_SPACING.xl,
    gap: READER_SPACING.md,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: READER_COLORS.surface,
    borderRadius: 12,
    padding: READER_SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  chapterItemActive: {
    borderWidth: 2,
    borderColor: READER_COLORS.primary,
  },
  chapterItemPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  chapterNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: READER_COLORS.progressBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: READER_SPACING.md,
  },
  chapterNumberText: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: READER_COLORS.textSecondary,
  },
  chapterNumberTextActive: {
    color: READER_COLORS.primary,
  },
  chapterInfo: {
    flex: 1,
  },
  chapterTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: READER_COLORS.textPrimary,
  },
  chapterTitleActive: {
    color: READER_COLORS.primary,
  },
  checkIcon: {
    marginLeft: READER_SPACING.sm,
  },
  footer: {
    paddingHorizontal: READER_SPACING.xxl,
    paddingTop: READER_SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: READER_COLORS.separator,
  },
  closeButton: {
    backgroundColor: READER_COLORS.primary,
    borderRadius: 12,
    paddingVertical: READER_SPACING.lg,
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: READER_COLORS.surface,
  },
});

export default ChapterMenuSheet;
