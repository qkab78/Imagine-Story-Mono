import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { FilterSection, FilterChipList } from '@/components/molecules/filters';
import { getThemes, getTones } from '@/api/stories/storyApi';
import { ThemeDTO, ToneDTO } from '@/api/stories/storyTypes';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { LIBRARY_COLORS, LIBRARY_SPACING } from '@/constants/library';
import { THEME_ICONS, TONE_ICONS } from '@/types/library';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = SCREEN_HEIGHT * 0.6;
const DISMISS_THRESHOLD = 100;

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  selectedThemes: string[];
  selectedTones: string[];
  onToggleTheme: (themeId: string) => void;
  onToggleTone: (toneId: string) => void;
  onReset: () => void;
}

export const FilterSheet: React.FC<FilterSheetProps> = ({
  visible,
  onClose,
  selectedThemes,
  selectedTones,
  onToggleTheme,
  onToggleTone,
  onReset,
}) => {
  const { t } = useAppTranslation('stories');
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(SHEET_HEIGHT);
  const backdropOpacity = useSharedValue(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch themes and tones
  const { data: themes = [] } = useQuery<ThemeDTO[]>({
    queryKey: ['themes'],
    queryFn: getThemes,
  });

  const { data: tones = [] } = useQuery<ToneDTO[]>({
    queryKey: ['tones'],
    queryFn: getTones,
  });

  // Transform themes for FilterSection with icons
  const themeItems = themes.map((theme) => ({
    id: theme.id,
    label: theme.name,
    icon: THEME_ICONS[theme.name] || THEME_ICONS.default,
  }));

  // Transform tones for FilterChipList with icons
  const toneItems = tones.map((tone) => ({
    id: tone.id,
    label: tone.name,
    icon: TONE_ICONS[tone.name] || TONE_ICONS.default,
  }));

  // Handle visibility changes
  useEffect(() => {
    if (visible) {
      setIsModalVisible(true);
      translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      backdropOpacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(SHEET_HEIGHT, { duration: 200 });
      backdropOpacity.value = withTiming(0, { duration: 200 }, () => {
        runOnJS(setIsModalVisible)(false);
      });
    }
  }, [visible]);

  // Pan gesture for drag to dismiss
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationY > 0) {
        translateY.value = event.translationY;
      }
    })
    .onEnd((event) => {
      if (event.translationY > DISMISS_THRESHOLD) {
        translateY.value = withTiming(SHEET_HEIGHT, { duration: 200 });
        backdropOpacity.value = withTiming(0, { duration: 200 }, () => {
          runOnJS(onClose)();
        });
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const sheetAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value,
  }));

  const hasActiveFilters =
    selectedThemes.length > 0 || selectedTones.length > 0;

  return (
    <Modal
      visible={isModalVisible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        </Animated.View>

        <GestureDetector gesture={panGesture}>
          <Animated.View
            style={[
              styles.sheet,
              sheetAnimatedStyle,
              { paddingBottom: insets.bottom + LIBRARY_SPACING.lg },
            ]}
          >
            {/* Handle */}
            <View style={styles.handleContainer}>
              <View style={styles.handle} />
            </View>

            {/* Header */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>{t('library.filters.title')}</Text>
                <Text style={styles.subtitle}>
                  {t('library.filters.subtitle')}
                </Text>
              </View>
              {hasActiveFilters && (
                <Pressable onPress={onReset} style={styles.resetButton}>
                  <Text style={styles.resetText}>{t('library.filters.reset')}</Text>
                </Pressable>
              )}
            </View>

            {/* Content */}
            <ScrollView
              style={styles.content}
              contentContainerStyle={styles.contentContainer}
              showsVerticalScrollIndicator={false}
            >
              {/* Themes Section - Horizontal scroll with icons */}
              {themeItems.length > 0 && (
                <FilterSection
                  title={t('library.filters.themes')}
                  items={themeItems}
                  selectedIds={selectedThemes}
                  onToggle={onToggleTheme}
                  horizontal
                />
              )}

              {/* Tones Section - Text chips only */}
              {toneItems.length > 0 && (
                <FilterChipList
                  title={t('library.filters.tones')}
                  items={toneItems}
                  selectedIds={selectedTones}
                  onToggle={onToggleTone}
                />
              )}
            </ScrollView>

            {/* Apply Button */}
            <View style={styles.footer}>
              <Pressable style={styles.applyButton} onPress={onClose}>
                <Text style={styles.applyButtonText}>{t('library.filters.apply')}</Text>
              </Pressable>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  sheet: {
    height: SHEET_HEIGHT,
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: 'hidden',
  },
  handleContainer: {
    alignItems: 'center',
    paddingVertical: LIBRARY_SPACING.md,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: LIBRARY_SPACING.xxl,
    paddingBottom: LIBRARY_SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: LIBRARY_COLORS.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: LIBRARY_COLORS.textSecondary,
    marginTop: 2,
  },
  resetButton: {
    paddingHorizontal: LIBRARY_SPACING.md,
    paddingVertical: LIBRARY_SPACING.sm,
  },
  resetText: {
    fontSize: 14,
    fontWeight: '600',
    color: LIBRARY_COLORS.accent,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: LIBRARY_SPACING.xxl,
  },
  footer: {
    paddingHorizontal: LIBRARY_SPACING.xxl,
    paddingTop: LIBRARY_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  applyButton: {
    backgroundColor: LIBRARY_COLORS.primary,
    borderRadius: 16,
    paddingVertical: LIBRARY_SPACING.lg,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
});

export default FilterSheet;
