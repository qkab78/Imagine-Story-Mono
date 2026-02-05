import React from 'react';
import { StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { useAppTranslation } from '@/hooks/useAppTranslation';

/**
 * Skin tone preset definition
 */
export interface SkinTonePreset {
  /** Unique identifier */
  id: string;
  /** Hex color code for display */
  color: string;
}

/**
 * Available skin tone presets
 * Matches the backend AppearancePresetService definitions
 */
export const SKIN_TONE_PRESETS: SkinTonePreset[] = [
  { id: 'light', color: '#FFDFC4' },
  { id: 'light-medium', color: '#F0C8A0' },
  { id: 'medium', color: '#D4A574' },
  { id: 'medium-tan', color: '#C68642' },
  { id: 'tan', color: '#8D5524' },
  { id: 'deep', color: '#4A2C2A' },
];

/**
 * Default skin tone preset ID
 */
export const DEFAULT_SKIN_TONE = 'light';

export interface SkinToneSelectorProps {
  /** Currently selected skin tone ID */
  selectedId: string;

  /** Callback when a skin tone is selected */
  onSelect: (skinToneId: string) => void;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * SkinToneSelector - Component for selecting character skin tone
 *
 * Displays a horizontal row of 6 circular color swatches representing
 * different skin tones. Used in the Hero Selection screen for human
 * character types (girl, boy, superhero, superheroine).
 *
 * @example
 * ```tsx
 * <SkinToneSelector
 *   selectedId={selectedSkinTone}
 *   onSelect={setSelectedSkinTone}
 * />
 * ```
 */
export const SkinToneSelector: React.FC<SkinToneSelectorProps> = ({
  selectedId,
  onSelect,
}) => {
  const { t } = useAppTranslation('stories');

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {t('creation.heroSelection.skinTone.label')}
      </Text>
      <View style={styles.swatchesContainer}>
        {SKIN_TONE_PRESETS.map((preset) => (
          <SkinToneSwatch
            key={preset.id}
            preset={preset}
            isSelected={preset.id === selectedId}
            onPress={() => onSelect(preset.id)}
          />
        ))}
      </View>
    </View>
  );
};

interface SkinToneSwatchProps {
  preset: SkinTonePreset;
  isSelected: boolean;
  onPress: () => void;
}

const SkinToneSwatch: React.FC<SkinToneSwatchProps> = ({
  preset,
  isSelected,
  onPress,
}) => {
  const { t } = useAppTranslation('stories');
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.85, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Get localized name for accessibility
  const presetName = t(`creation.heroSelection.skinTone.presets.${preset.id}` as any);

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.swatch,
        { backgroundColor: preset.color },
        isSelected && styles.swatchSelected,
        animatedStyle,
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={presetName}
      accessibilityState={{ selected: isSelected }}
      accessibilityHint={t('creation.heroSelection.skinTone.selectHint')}
    >
      {isSelected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  swatchesContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  swatchSelected: {
    borderColor: colors.warmAmber,
    shadowColor: colors.warmAmber,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  checkmark: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.warmAmber,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default SkinToneSelector;
