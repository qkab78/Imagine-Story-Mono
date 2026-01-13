import React from 'react';
import { StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';
import { SelectionCheckmark } from '@/components/atoms/creation/SelectionCheckmark';

export interface SelectOptionProps {
  /** Label à afficher */
  label: string;

  /** Valeur de l'option */
  value: string | number;

  /** État de sélection */
  isSelected: boolean;

  /** Callback lors de la sélection */
  onSelect: () => void;

  /** Icône emoji optionnel */
  icon?: string;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

/**
 * SelectOption - Molecule pour une option de sélection
 *
 * Option cliquable avec animation et checkmark.
 * Utilisé dans les sélecteurs de paramètres (âge, chapitres, langue).
 *
 * @example
 * ```tsx
 * <SelectOption
 *   label="5 ans"
 *   value={5}
 *   icon="👦"
 *   isSelected={selectedAge === 5}
 *   onSelect={() => setSelectedAge(5)}
 * />
 * ```
 */
export const SelectOption: React.FC<SelectOptionProps> = ({
  label,
  value,
  isSelected,
  onSelect,
  icon,
}) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 10, stiffness: 400 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10, stiffness: 400 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedTouchableOpacity
      style={[
        styles.container,
        isSelected && styles.containerSelected,
        animatedStyle,
      ]}
      onPress={onSelect}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: isSelected }}
    >
      {icon && <Text style={styles.icon}>{icon}</Text>}
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {label}
      </Text>
      <SelectionCheckmark selected={isSelected} size={20} />
    </AnimatedTouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 12,
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  containerSelected: {
    borderColor: colors.warmAmber,
    backgroundColor: 'rgba(246, 193, 119, 0.05)',
    shadowColor: colors.warmAmber,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 4,
  },
  icon: {
    fontSize: 24,
  },
  label: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  labelSelected: {
    color: colors.forestGreen,
  },
});

export default SelectOption;
