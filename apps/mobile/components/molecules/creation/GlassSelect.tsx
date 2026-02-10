import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  Modal,
  ScrollView,
  Platform,
  Dimensions,
} from 'react-native';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { BlurView } from 'expo-blur';

export interface SelectOption {
  label: string;
  value: string | number;
  icon?: string;
}

export interface GlassSelectProps {
  /** Placeholder quand aucune valeur n'est sélectionnée */
  placeholder: string;

  /** Liste des options */
  options: SelectOption[];

  /** Valeur sélectionnée */
  value: string | number | null;

  /** Callback lors de la sélection */
  onValueChange: (value: string | number) => void;

  /** Message d'erreur optionnel */
  error?: string;

  /** Label au-dessus du select */
  label?: string;
}

/**
 * GlassSelect - Molecule pour un select avec effet glass
 *
 * Select avec dropdown modal et effet glass.
 * Utilisé dans l'écran Settings pour langue, âge, chapitres.
 *
 * @example
 * ```tsx
 * const options = [
 *   { label: '3 ans', value: 3, icon: '👶' },
 *   { label: '4 ans', value: 4, icon: '🧒' },
 * ];
 *
 * <GlassSelect
 *   label="Âge de l'enfant"
 *   placeholder="Sélectionnez un âge"
 *   options={options}
 *   value={selectedAge}
 *   onValueChange={setSelectedAge}
 * />
 * ```
 */
export const GlassSelect: React.FC<GlassSelectProps> = ({
  placeholder,
  options,
  value,
  onValueChange,
  error,
  label,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const borderColor = useSharedValue('transparent');

  const selectedOption = options.find((opt) => opt.value === value);

  const handleOpen = () => {
    setIsOpen(true);
    borderColor.value = withTiming(colors.mintGreen, {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  };

  const handleClose = () => {
    setIsOpen(false);
    borderColor.value = withTiming('transparent', {
      duration: 200,
      easing: Easing.out(Easing.ease),
    });
  };

  const handleSelect = (optionValue: string | number) => {
    onValueChange(optionValue);
    handleClose();
  };

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        onPress={handleOpen}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={label || placeholder}
      >
        <Animated.View style={[styles.selectContainer, animatedBorderStyle]}>
          <BlurView intensity={20} tint="light" style={styles.blurView}>
            <View style={styles.selectContent}>
              {selectedOption?.icon && (
                <Text style={styles.selectedIcon}>{selectedOption.icon}</Text>
              )}
              <Text
                style={[
                  styles.selectText,
                  !selectedOption && styles.placeholderText,
                ]}
              >
                {selectedOption?.label || placeholder}
              </Text>
              <Text style={styles.chevron}>▼</Text>
            </View>
          </BlurView>
        </Animated.View>
      </TouchableOpacity>

      {error && <Text style={styles.errorText}>{error}</Text>}

      {/* Modal Dropdown */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
          <View style={styles.modalContent}>
            <BlurView intensity={80} tint="light" style={styles.modalBlur}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>{label || placeholder}</Text>
                <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              <ScrollView
                style={styles.optionsList}
                showsVerticalScrollIndicator={false}
              >
                {options.map((option, index) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.option,
                      option.value === value && styles.optionSelected,
                      index === options.length - 1 && styles.lastOption,
                    ]}
                    onPress={() => handleSelect(option.value)}
                    activeOpacity={0.7}
                  >
                    {option.icon && (
                      <Text style={styles.optionIcon}>{option.icon}</Text>
                    )}
                    <Text
                      style={[
                        styles.optionLabel,
                        option.value === value && styles.optionLabelSelected,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {option.value === value && (
                      <Text style={styles.checkmark}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </BlurView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  selectContainer: {
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  blurView: {
    overflow: 'hidden',
    borderRadius: 12,
  },
  selectContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    gap: 10,
  },
  selectedIcon: {
    fontSize: 20,
  },
  selectText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  placeholderText: {
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 12,
    color: colors.mintGreen,
  },
  errorText: {
    fontSize: 13,
    color: '#E74C3C',
    marginTop: 6,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  modalBlur: {
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(127, 184, 160, 0.2)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(127, 184, 160, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 16,
    color: colors.forestGreen,
    fontWeight: '600',
  },
  optionsList: {
    backgroundColor: 'rgba(255, 255, 255)',
    maxHeight: Dimensions.get('window').height * 0.6,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(127, 184, 160, 0.1)',
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionSelected: {
    backgroundColor: 'rgba(246, 193, 119, 0.1)',
  },
  optionIcon: {
    fontSize: 24,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  optionLabelSelected: {
    color: colors.forestGreen,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 18,
    color: colors.warmAmber,
    fontWeight: '700',
  },
});

export default GlassSelect;
