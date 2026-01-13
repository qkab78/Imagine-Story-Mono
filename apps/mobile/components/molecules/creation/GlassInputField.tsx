import React, { useState } from 'react';
import { StyleSheet, TextInput, Platform, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/theme/colors';

export interface GlassInputFieldProps {
  /** Placeholder du champ */
  placeholder: string;

  /** Valeur du champ */
  value: string;

  /** Callback au changement de texte */
  onChangeText: (text: string) => void;

  /** Message d'erreur */
  error?: string;

  /** Type de clavier */
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';

  /** Capitalisation automatique */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';

  /** Nombre maximal de caractères */
  maxLength?: number;

  /** Style personnalisé */
  style?: any;
}

/**
 * GlassInputField - Molecule input field avec effet glass
 *
 * Champ de saisie avec style glass, focus animation et gestion d'erreur.
 * Utilisé dans Hero Selection pour le nom du héros.
 *
 * @example
 * ```tsx
 * <GlassInputField
 *   placeholder="Prénom du héros..."
 *   value={heroName}
 *   onChangeText={setHeroName}
 *   error={errors.heroName}
 *   maxLength={30}
 * />
 * ```
 */
export const GlassInputField: React.FC<GlassInputFieldProps> = ({
  placeholder,
  value,
  onChangeText,
  error,
  keyboardType = 'default',
  autoCapitalize = 'words',
  maxLength,
  style,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue('transparent');

  const handleFocus = () => {
    setIsFocused(true);
    borderColor.value = withTiming(colors.mintGreen, { duration: 200 });
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!error) {
      borderColor.value = withTiming('transparent', { duration: 200 });
    }
  };

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  // Si erreur, forcer la bordure rouge
  if (error && borderColor.value !== '#EF4444') {
    borderColor.value = '#EF4444';
  }

  return (
    <View style={[styles.container, style]}>
      <Animated.View
        style={[
          styles.inputContainer,
          animatedBorderStyle,
          error && styles.inputContainerError,
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          maxLength={maxLength}
          accessibilityLabel={placeholder}
          accessibilityHint={error || undefined}
        />
      </Animated.View>

      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF', // surface-elevated
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 16,
    shadowColor: colors.deepForest,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  inputContainerError: {
    borderColor: '#EF4444',
  },
  input: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    fontSize: 18,
    fontWeight: '400',
    color: colors.textPrimary,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
  errorText: {
    marginTop: 8,
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : 'Roboto',
  },
});

export default GlassInputField;
