import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, useController, FieldError } from 'react-hook-form';
import Text from '@/components/ui/Text';
import TextInput from '@/components/ui/TextInput';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';
import type { LucideIcon } from 'lucide-react-native';

interface FormFieldProps {
  name: string;
  label: string;
  placeholder: string;
  control: Control<any>;
  Icon: LucideIcon;
  error?: FieldError;
  showPassword?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  maxLength?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  placeholder,
  control,
  Icon,
  error,
  showPassword,
  multiline,
  numberOfLines,
  maxLength,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        name={name}
        placeholder={placeholder}
        control={control}
        Icon={Icon}
        showPassword={showPassword}
        multiline={multiline}
        numberOfLines={numberOfLines}
        maxLength={maxLength}
      />
      {error && (
        <Text style={styles.errorText}>{error.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default FormField;
