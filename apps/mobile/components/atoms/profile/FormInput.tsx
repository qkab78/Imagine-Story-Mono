import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, type TextInputProps } from 'react-native';
import { PROFILE_COLORS, PROFILE_SPACING, PROFILE_DIMENSIONS } from '@/constants/profile';

interface FormInputProps extends Omit<TextInputProps, 'style'> {
  label: string;
}

export const FormInput: React.FC<FormInputProps> = ({ label, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused]}
        placeholderTextColor={PROFILE_COLORS.textMuted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: PROFILE_SPACING.xl,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textSecondary,
    marginBottom: PROFILE_SPACING.sm,
  },
  input: {
    paddingHorizontal: PROFILE_SPACING.lg,
    paddingVertical: 14,
    backgroundColor: PROFILE_COLORS.inputBackground,
    borderWidth: 2,
    borderColor: PROFILE_COLORS.inputBorder,
    borderRadius: 12,
    fontSize: 16,
    fontFamily: 'Nunito',
    color: PROFILE_COLORS.textPrimary,
  },
  inputFocused: {
    borderColor: PROFILE_COLORS.inputBorderFocus,
    backgroundColor: PROFILE_COLORS.surface,
  },
});

export default FormInput;
