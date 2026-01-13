import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { Text } from 'react-native';
import { SelectOption } from '@/components/molecules/creation/SelectOption';
import { colors } from '@/theme/colors';

export interface SettingOption {
  label: string;
  value: string | number;
  icon?: string;
}

export interface SettingsSelectorProps {
  /** Titre de la section */
  title: string;

  /** Sous-titre explicatif optionnel */
  subtitle?: string;

  /** Liste des options */
  options: SettingOption[];

  /** Valeur sélectionnée */
  selectedValue: string | number | null;

  /** Callback lors de la sélection */
  onSelect: (value: string | number) => void;
}

/**
 * SettingsSelector - Organism pour sélectionner un paramètre
 *
 * Sélecteur vertical avec titre et liste d'options.
 * Utilisé dans l'écran Settings pour langue, âge, chapitres.
 *
 * @example
 * ```tsx
 * const ageOptions = [
 *   { label: '3 ans', value: 3, icon: '👶' },
 *   { label: '4 ans', value: 4, icon: '🧒' },
 * ];
 *
 * <SettingsSelector
 *   title="Quel est l'âge de votre enfant ?"
 *   subtitle="Pour adapter le vocabulaire et la complexité"
 *   options={ageOptions}
 *   selectedValue={selectedAge}
 *   onSelect={setSelectedAge}
 * />
 * ```
 */
export const SettingsSelector: React.FC<SettingsSelectorProps> = ({
  title,
  subtitle,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>

      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <SelectOption
            key={option.value}
            label={option.label}
            value={option.value}
            icon={option.icon}
            isSelected={option.value === selectedValue}
            onSelect={() => onSelect(option.value)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 32,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
    lineHeight: 26,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  subtitle: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  optionsContainer: {
    gap: 10,
  },
});

export default SettingsSelector;
