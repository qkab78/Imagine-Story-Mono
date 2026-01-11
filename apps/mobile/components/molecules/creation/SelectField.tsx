import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Control, useController, FieldError } from 'react-hook-form';
import { Adapt, Select as TamaguiSelect, Sheet, YStack } from 'tamagui';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import Text from '@/components/ui/Text';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

interface SelectOption {
  label: string;
  value: string | number;
}

interface SelectFieldProps {
  name: string;
  label: string;
  placeholder: string;
  options: SelectOption[];
  control: Control<any>;
  error?: FieldError;
}

export const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  placeholder,
  options,
  control,
  error,
}) => {
  const { field } = useController({
    name,
    control,
  });

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TamaguiSelect 
        value={String(field.value)}
        onValueChange={(value) => {
          const numValue = Number(value);
          field.onChange(isNaN(numValue) ? value : numValue);
        }}
        disablePreventBodyScroll
      >
        <TamaguiSelect.Trigger 
          iconAfter={ArrowDown} 
          style={styles.selectTrigger}
        >
          <TamaguiSelect.Value 
            placeholder={placeholder}
            style={styles.selectValue}
          />
        </TamaguiSelect.Trigger>

        <Adapt platform="touch">
          <Sheet native modal dismissOnSnapToBottom animation="medium">
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              backgroundColor="rgba(0,0,0,0.5)"
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <TamaguiSelect.Content zIndex={200000}>
          <TamaguiSelect.ScrollUpButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ArrowUp size={20} />
            </YStack>
          </TamaguiSelect.ScrollUpButton>
          
          <TamaguiSelect.Viewport minWidth={200}>
            <TamaguiSelect.Group>
              <TamaguiSelect.Label>
                <Text style={styles.selectLabel}>{label}</Text>
              </TamaguiSelect.Label>
              
              {options.map((option, index) => (
                <TamaguiSelect.Item 
                  key={String(option.value)} 
                  value={String(option.value)} 
                  index={index}
                >
                  <TamaguiSelect.ItemText>
                    <Text style={styles.selectItemText}>{option.label}</Text>
                  </TamaguiSelect.ItemText>
                </TamaguiSelect.Item>
              ))}
            </TamaguiSelect.Group>
          </TamaguiSelect.Viewport>
          
          <TamaguiSelect.ScrollDownButton
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            height="$3"
          >
            <YStack zIndex={10}>
              <ArrowDown size={20} />
            </YStack>
          </TamaguiSelect.ScrollDownButton>
        </TamaguiSelect.Content>
      </TamaguiSelect>
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
  selectTrigger: {
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderWidth: 2,
    borderColor: colors.cardBorder,
    borderRadius: 16,
    padding: spacing.base,
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.textSecondary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    width: '100%',
    minHeight: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectValue: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  selectLabel: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.medium,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  selectItemText: {
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily.primary,
    fontWeight: '500',
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default SelectField;
