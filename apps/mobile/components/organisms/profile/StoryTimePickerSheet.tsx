import { useState } from 'react';
import { View, Text, Modal, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { SheetHeader } from '@/components/atoms/profile';
import { useAppTranslation } from '@/hooks/useAppTranslation';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS } from '@/constants/profile';

interface StoryTimePickerSheetProps {
  visible: boolean;
  onClose: () => void;
  hour: number;
  minute: number;
  onSave: (hour: number, minute: number) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export const StoryTimePickerSheet: React.FC<StoryTimePickerSheetProps> = ({
  visible,
  onClose,
  hour,
  minute,
  onSave,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useAppTranslation('profile');

  const [selectedHour, setSelectedHour] = useState(hour);
  const [selectedMinute, setSelectedMinute] = useState(minute);

  const handleSave = () => {
    onSave(selectedHour, selectedMinute);
    onClose();
  };

  const formatValue = (value: number) => String(value).padStart(2, '0');

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <LinearGradient
        colors={[PROFILE_COLORS.backgroundTop, PROFILE_COLORS.backgroundBottom]}
        style={styles.container}
      >
        <View style={{ paddingTop: insets.top }}>
          <SheetHeader title={t('storyTime.title')} onBack={onClose} />
        </View>

        <View style={[styles.content, { paddingBottom: insets.bottom + PROFILE_SPACING.xxl }]}>
          <Text style={styles.description}>{t('storyTime.description')}</Text>

          <View style={styles.card}>
            <Text style={styles.previewTime}>
              {formatValue(selectedHour)}:{formatValue(selectedMinute)}
            </Text>

            <View style={styles.pickersRow}>
              {/* Hour picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>{t('storyTime.hours')}</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {HOURS.map((h) => (
                    <Pressable
                      key={h}
                      style={[styles.pickerItem, selectedHour === h && styles.pickerItemSelected]}
                      onPress={() => setSelectedHour(h)}
                    >
                      <Text style={[styles.pickerItemText, selectedHour === h && styles.pickerItemTextSelected]}>
                        {formatValue(h)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.pickerSeparator}>:</Text>

              {/* Minute picker */}
              <View style={styles.pickerColumn}>
                <Text style={styles.pickerLabel}>{t('storyTime.minutes')}</Text>
                <ScrollView style={styles.pickerScroll} showsVerticalScrollIndicator={false}>
                  {MINUTES.map((m) => (
                    <Pressable
                      key={m}
                      style={[styles.pickerItem, selectedMinute === m && styles.pickerItemSelected]}
                      onPress={() => setSelectedMinute(m)}
                    >
                      <Text style={[styles.pickerItemText, selectedMinute === m && styles.pickerItemTextSelected]}>
                        {formatValue(m)}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>
          </View>

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>{t('storyTime.save')}</Text>
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
  content: {
    flex: 1,
    padding: PROFILE_SPACING.xl,
  },
  description: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textMuted,
    marginBottom: PROFILE_SPACING.xl,
    textAlign: 'center',
  },
  card: {
    backgroundColor: PROFILE_COLORS.surface,
    borderRadius: PROFILE_DIMENSIONS.cardBorderRadius,
    padding: PROFILE_SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  previewTime: {
    fontSize: 48,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.primary,
    marginBottom: PROFILE_SPACING.lg,
  },
  pickersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: PROFILE_SPACING.md,
  },
  pickerColumn: {
    alignItems: 'center',
    flex: 1,
  },
  pickerLabel: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textMuted,
    marginBottom: PROFILE_SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pickerScroll: {
    maxHeight: 200,
    width: '100%',
  },
  pickerSeparator: {
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textMuted,
    marginTop: 20,
  },
  pickerItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 2,
  },
  pickerItemSelected: {
    backgroundColor: `${PROFILE_COLORS.primary}15`,
  },
  pickerItemText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
  },
  pickerItemTextSelected: {
    color: PROFILE_COLORS.primary,
    fontWeight: '700',
  },
  saveButton: {
    backgroundColor: PROFILE_COLORS.primary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: PROFILE_SPACING.xl,
    shadowColor: PROFILE_COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Nunito',
    color: '#FFFFFF',
  },
});

export default StoryTimePickerSheet;
